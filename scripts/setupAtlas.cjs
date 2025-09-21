#!/usr/bin/env node

/**
 * MongoDB Atlas Setup Helper Script
 * This script helps you configure MongoDB Atlas for your Quiz App
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupAtlas() {
  console.log('🚀 MongoDB Atlas Setup Helper for Quiz App\n');
  
  console.log('📋 Before running this script, make sure you have:');
  console.log('   1. Created a MongoDB Atlas account at https://www.mongodb.com/atlas');
  console.log('   2. Created a cluster (M0 Sandbox is free)');
  console.log('   3. Created a database user with read/write permissions');
  console.log('   4. Added your IP to the network access list\n');
  
  const proceed = await question('Have you completed the above steps? (y/n): ');
  if (proceed.toLowerCase() !== 'y') {
    console.log('Please complete the Atlas setup first, then run this script again.');
    rl.close();
    return;
  }
  
  console.log('\n📝 Please provide your MongoDB Atlas details:\n');
  
  const username = await question('Atlas Username: ');
  const password = await question('Atlas Password: ');
  const clusterName = await question('Cluster Name (e.g., quiz-app-cluster): ');
  const clusterUrl = await question('Cluster URL (e.g., xxxxx.mongodb.net): ');
  
  // Generate connection string
  const connectionString = `mongodb+srv://${username}:${password}@${clusterUrl}/quizapp?retryWrites=true&w=majority`;
  
  console.log('\n🔧 Generated Configuration:');
  console.log('Connection String:', connectionString.replace(password, '***'));
  
  const confirm = await question('\nDoes this look correct? (y/n): ');
  if (confirm.toLowerCase() !== 'y') {
    console.log('Setup cancelled. Please run the script again with correct details.');
    rl.close();
    return;
  }
  
  // Update .env file
  const envPath = path.join(__dirname, '..', '.env');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    // Update existing MONGODB_URI
    if (envContent.includes('MONGODB_URI=')) {
      envContent = envContent.replace(/MONGODB_URI=.*/, `MONGODB_URI=${connectionString}`);
    } else {
      envContent += `\nMONGODB_URI=${connectionString}`;
    }
  } else {
    // Create new .env file
    const examplePath = path.join(__dirname, '..', '.env.example');
    if (fs.existsSync(examplePath)) {
      envContent = fs.readFileSync(examplePath, 'utf8');
      envContent = envContent.replace(
        /MONGODB_URI=mongodb\+srv:\/\/.*/, 
        `MONGODB_URI=${connectionString}`
      );
    } else {
      envContent = `MONGODB_URI=${connectionString}\n`;
    }
  }
  
  // Add Atlas-specific variables
  if (!envContent.includes('MONGODB_USERNAME=')) {
    envContent += `\nMONGODB_USERNAME=${username}`;
  }
  if (!envContent.includes('MONGODB_PASSWORD=')) {
    envContent += `\nMONGODB_PASSWORD=${password}`;
  }
  if (!envContent.includes('MONGODB_CLUSTER=')) {
    envContent += `\nMONGODB_CLUSTER=${clusterName}`;
  }
  
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Configuration saved to .env file!');
  console.log('\n🧪 Testing connection...');
  
  // Test connection
  try {
    const mongoose = require('mongoose');
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    
    await mongoose.disconnect();
    
    console.log('\n🎉 Setup Complete!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run server:dev');
    console.log('2. Check the logs for "MongoDB Atlas (Cloud)" connection');
    console.log('3. Your quiz data will now be stored globally in the cloud!');
    
  } catch (error) {
    console.error('\n❌ Connection test failed:', error.message);
    console.log('\n🔍 Common issues:');
    console.log('- Check your username and password');
    console.log('- Verify your IP is whitelisted in Atlas Network Access');
    console.log('- Ensure your cluster is running');
    console.log('- Check the cluster URL format');
  }
  
  rl.close();
}

// Run the setup
setupAtlas().catch(console.error);
