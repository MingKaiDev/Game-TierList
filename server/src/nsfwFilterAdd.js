const admin = require("firebase-admin");

// Load Firebase service account key
const serviceAccount = require("../firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

(async () => {
  try {
    console.log("🔄 Starting NSFW attribute addition...");
    
    // Get all documents from the blogs collection
    const blogsSnapshot = await db.collection("blogs").get();
    
    if (blogsSnapshot.empty) {
      console.log("📭 No blogs found in the collection.");
      return;
    }

    console.log(`📊 Found ${blogsSnapshot.size} blog documents to update.`);
    
    let updatedCount = 0;
    let skippedCount = 0;

    // Process each document
    for (const doc of blogsSnapshot.docs) {
      const docData = doc.data();
      const docId = doc.id;
      
      // Check if NSFW attribute already exists
      if (docData.hasOwnProperty('NSFW')) {
        console.log(`⏭️  Skipped (NSFW already exists): ${docData.title || docId}`);
        skippedCount++;
        continue;
      }

      try {
        // Add NSFW attribute with default value of false
        await doc.ref.update({
          NSFW: false
        });
        
        console.log(`✅ Updated: ${docData.title || docId}`);
        updatedCount++;
      } catch (err) {
        console.error(`❌ Failed to update ${docData.title || docId}:`, err.message);
      }
    }

    console.log("🎉 NSFW attribute addition complete!");
    console.log(`📈 Updated: ${updatedCount} documents`);
    console.log(`⏭️  Skipped: ${skippedCount} documents`);
    
  } catch (err) {
    console.error("💥 Error during NSFW attribute addition:", err.message);
  }
})();