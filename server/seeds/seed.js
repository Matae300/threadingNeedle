const db = require('../config/connection');
const { Thread } = require('../models');  // Ensure these are the correct paths
const threadSeeds = require('./threadData.json');

const cleanDB = require('./cleanDB');

db.once('open', async () => {
  try {
    await cleanDB('Thread', 'threads');

    // Create threads
    const threads = await Thread.create(threadSeeds);
    console.log(`${threads.length} threads added successfully!`);

  } catch (err) {
    console.error('Error during seeding process:', err);
    if (err && err.errors) {
      Object.keys(err.errors).forEach(key => {
        console.error(`Validation error for ${key}: ${err.errors[key].message}`);
      });
    }
  } finally {
    console.log('Seeding process completed.');
    process.exit(0);
  }
});