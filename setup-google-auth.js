const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('⚠️  .env file already exists!');
  rl.question('Do you want to overwrite it? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      createEnvFile();
    } else {
      console.log('Setup cancelled. Your existing .env file remains unchanged.');
      rl.close();
    }
  });
} else {
  createEnvFile();
}

function createEnvFile() {
  console.log('\n📝 Let\'s set up your Google OAuth credentials...\n');
  
  rl.question('Enter your Google OAuth Client ID: ', (clientId) => {
    if (!clientId.trim()) {
      console.log('❌ Client ID is required!');
      rl.close();
      return;
    }
    
    rl.question('Enter your Google OAuth Client Secret: ', (clientSecret) => {
      if (!clientSecret.trim()) {
        console.log('❌ Client Secret is required!');
        rl.close();
        return;
      }
      
      rl.question('Enter your API Base URL (default: http://localhost:3001): ', (apiUrl) => {
        const finalApiUrl = apiUrl.trim() || 'http://localhost:3001';
        
        // Create .env content
        const envContent = `# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=${clientId.trim()}
VITE_GOOGLE_CLIENT_SECRET=${clientSecret.trim()}

# API Configuration
VITE_API_BASE_URL=${finalApiUrl}

# App Configuration
VITE_APP_NAME=Find My Stage
VITE_APP_VERSION=1.0.0

# ⚠️  IMPORTANT: Never commit this file to version control!
# Add .env to your .gitignore file
`;

        try {
          fs.writeFileSync(envPath, envContent);
          console.log('\n✅ .env file created successfully!');
          console.log('\n📋 Next steps:');
          console.log('1. Restart your development server');
          console.log('2. Test Google Sign-In at /auth');
          console.log('3. Check the GOOGLE_AUTH_SETUP.md for detailed instructions');
          
          // Create .gitignore entry if it doesn't exist
          const gitignorePath = path.join(__dirname, '.gitignore');
          if (fs.existsSync(gitignorePath)) {
            const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
            if (!gitignoreContent.includes('.env')) {
              fs.appendFileSync(gitignorePath, '\n# Environment variables\n.env\n');
              console.log('4. ✅ Added .env to .gitignore');
            }
          } else {
            fs.writeFileSync(gitignorePath, '# Environment variables\n.env\n');
            console.log('4. ✅ Created .gitignore with .env entry');
          }
          
        } catch (error) {
          console.error('❌ Error creating .env file:', error.message);
        }
        
        rl.close();
      });
    });
  });
}

rl.on('close', () => {
  console.log('\n🎉 Setup complete! Happy coding!');
  process.exit(0);
});
