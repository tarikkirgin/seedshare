const { ok } = require("assert");
const express = require("express");
const fs = require("fs").promises;
const sqlite3 = require("sqlite3").verbose();
var cors = require('cors')
const app = express();
const port = 4000;


function printDatabase() {
    db.all("SELECT * FROM links", [], (err, rows) => {
        if (err) {
            console.error("Error fetching database:", err);
            return;
        }
        console.log("Database Contents:", rows);
    });
}



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getWordsFromFile(filePath) {
    try {
        const data = await fs.readFile(filePath, "utf8");
        const jsonData = JSON.parse(data);

        if (!jsonData.words || !Array.isArray(jsonData.words)) {
            throw new Error("Invalid JSON format: missing 'words' array");
        }

        const words = [];
        for (let i = 0; i < 4; i++) {
            words.push(jsonData.words[getRandomInt(0, jsonData.words.length - 1)]);
        }

        return words;
    } catch (err) {
        console.error("Error fetching or processing data:", err);
        return null;
    }
}

async function insertLink(words, inputString, res) {
    const singleWord = words.join("-"); // Join words into a single string with hyphens
    console.log("Generated Key:", singleWord);

    db.run("INSERT INTO links (words, magnet) VALUES (?, ?)", [singleWord, inputString], async function (err) {
        if (err) {
            if (err.code === "SQLITE_CONSTRAINT") {
                console.warn("Duplicate key error, retrying with new words...");
                
                // Retry with new words
                const newWords = await getWordsFromFile("map.json");
                if (!newWords) {
                    return res.status(500).json({ error: "Failed to generate new words" });
                }
                return insertLink(newWords, inputString, res);
            }

            console.error("Error inserting:", err);
            return res.status(500).json({ error: "Database insert failed" });
        }

        res.json({ success: true, words: singleWord });
    });
}

// Initialize SQLite database
const db = new sqlite3.Database(":memory:", (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Connected to the in-memory SQLite database.");
        db.run("CREATE TABLE links (words TEXT PRIMARY KEY, magnet TEXT)");
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.post("/generateWords", async (req, res) => {
    const { inputString } = req.body;
    console.log(req.body);
    if (!inputString || typeof inputString !== "string") {
        return res.status(400).json({ error: "Invalid input. Please provide a magnet link." });
    }

    const words = await getWordsFromFile("map.json");
    if (!words) {
        return res.status(500).json({ error: "Failed to fetch words from file" });
    }

    insertLink(words, inputString, res);
});

app.post("/getMagnet", async(req, res) => {
    const { words } = req.body;
    console.log(words);
    if (!words || typeof words !== "string") {
        return res.status(400).json({ error: "Invalid input. Please provide words" });
    }
    db.all("SELECT magnet FROM links WHERE words=(?) ", [words], (err, rows) => {
        if (err) {
            console.error("Error checking:", err);
            return res.status(500).json({ error: "Database check failed" });
        }
        console.log(rows[0]["magnet"]);
        res.json({ success: true, magnet: rows[0]["magnet"] });
    });
});

app.get("/debug", async (req, res) => {
    printDatabase()
    return res.json({ success: true });
})

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
