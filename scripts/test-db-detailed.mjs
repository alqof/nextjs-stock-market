import 'dotenv/config';
import mongoose from 'mongoose';

async function testDatabaseConnection() {
    const uri = process.env.MONGODB_URI;
    
    console.log('🔍 Starting database connection test...\n');
    
    // Check if URI is provided
    if (!uri) {
        console.error('❌ ERROR: MONGODB_URI must be set in .env file');
        process.exit(1);
    }
    
    // Mask the password in the URI for logging
    const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
    console.log(`📍 Connection URI: ${maskedUri}`);
    
    try {
        const startTime = Date.now();
        
        // Connect to MongoDB
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect(uri, { 
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000, // 5 second timeout
            connectTimeoutMS: 10000 // 10 second connection timeout
        });
        
        const connectionTime = Date.now() - startTime;
        
        // Get connection details
        const dbName = mongoose.connection?.name || '(unknown)';
        const host = mongoose.connection?.host || '(unknown)';
        const readyState = mongoose.connection?.readyState;
        
        console.log('✅ SUCCESS: Connected to MongoDB!');
        console.log(`📊 Database Info:`);
        console.log(`   - Database: ${dbName}`);
        console.log(`   - Host: ${host}`);
        console.log(`   - Connection Time: ${connectionTime}ms`);
        console.log(`   - Ready State: ${readyState} (1 = connected)`);
        
        // Test a simple operation
        console.log('\n🧪 Testing database operations...');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`📦 Found ${collections.length} collections in database`);
        
        if (collections.length > 0) {
            console.log('📋 Collections:');
            collections.forEach(col => console.log(`   - ${col.name}`));
        }
        
        // Test connection health
        const adminDb = mongoose.connection.db.admin();
        const serverStatus = await adminDb.ping();
        console.log(`💓 Server Ping: ${serverStatus.ok === 1 ? 'OK' : 'FAILED'}`);
        
        console.log('\n🎉 All tests passed! Your database connection is working properly.');
        
    } catch (err) {
        console.error('\n❌ ERROR: Database connection failed');
        
        if (err.message.includes('authentication failed')) {
            console.error('🔐 Authentication Error: Please check your username and password in MONGODB_URI');
        } else if (err.message.includes('ENOTFOUND')) {
            console.error('🌐 Network Error: Cannot reach the database host. Check your connection string and internet connectivity.');
        } else if (err.message.includes('timeout')) {
            console.error('⏰ Timeout Error: Connection timed out. The database might be slow or unreachable.');
        } else {
            console.error('📝 Full error details:');
            console.error(err);
        }
        
        process.exit(1);
    } finally {
        // Clean up connection
        try {
            await mongoose.connection.close();
            console.log('\n🔌 Database connection closed.');
        } catch (closeErr) {
            console.error('⚠️  Warning: Error closing connection:', closeErr.message);
        }
        
        process.exit(0);
    }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

testDatabaseConnection();