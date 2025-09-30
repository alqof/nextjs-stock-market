import 'dotenv/config';
import { connectToDatabase } from '../database/mongoose.js';

async function testAppDatabaseConnection() {
    console.log('🧪 Testing database connection using app\'s connectToDatabase function...\n');
    
    try {
        const connection = await connectToDatabase();
        
        console.log('✅ SUCCESS: Database connection established!');
        console.log('📊 Connection details:');
        console.log(`   - Database: ${connection.connection.name}`);
        console.log(`   - Host: ${connection.connection.host}`);
        console.log(`   - Ready State: ${connection.connection.readyState}`);
        
        // Test basic operation
        const collections = await connection.connection.db.listCollections().toArray();
        console.log(`📦 Collections found: ${collections.length}`);
        
        console.log('\n🎉 Your app\'s database connection is working properly!');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ ERROR: Database connection failed');
        console.error('📝 Error details:', error.message);
        process.exit(1);
    }
}

testAppDatabaseConnection();