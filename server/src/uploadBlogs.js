const admin = require("firebase-admin");
const xlsx = require("xlsx");
const path = require("path");

// Load Firebase service account key
const serviceAccount = require("../firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Load Excel data
const workbook = xlsx.readFile(path.join(__dirname, "Video Game TierList.xlsx"));
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet);

// Helper to convert letter grades to numeric rating
const letterToRating = (letter) => {
  const scale = { S: 9, A: 8, B: 7, C: 6, D: 5 };
  return scale[String(letter).trim().toUpperCase()] || 6;
};

(async () => {
  for (const row of rows) {
    const title = row["Video Game Title"];
    if (!title) continue;

    const rating = letterToRating(row["Rating"]);
    const gameplayTime = parseInt(row["Hours Played"] || 0);
    const year = parseInt(row["Year Played"]);
    const date = !isNaN(year) ? new Date(`${year}-01-01`).toISOString() : new Date().toISOString();

    const blogData = {
      title,
      rating,
      gameplayTime,
      date,
      content: "Template content.",
      summary: "Template summary.",
      authorUid: "q15OkG2dszUlg90yWKIi1RhTS3t2",
    };

    try {
      // Optional: Skip if title already exists
      const existing = await db.collection("blogs").where("title", "==", title).get();
      if (!existing.empty) {
        console.log(`Skipped (exists): ${title}`);
        continue;
      }

      await db.collection("blogs").add(blogData);
      console.log(`Uploaded: ${title}`);
    } catch (err) {
      console.error(`❌ Failed: ${title}`, err.message);
    }
  }

  console.log("✅ Upload complete.");
})();
