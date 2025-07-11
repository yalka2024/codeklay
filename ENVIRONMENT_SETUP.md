# 🔧 CodePal Environment Setup Guide

## Overview
This guide will help you set up the environment variables needed for CodePal to run properly.

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3001

# Database
DATABASE_URL="file:./dev.db"

# OpenAI API (for AI features)
OPENAI_SECRET_KEY=your-openai-api-key-here

# WebSocket Server
WS_PORT=3002

# Development
NODE_ENV=development
```

## 🔑 Getting API Keys

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key and add it to your `.env` file

### NextAuth Secret
Generate a secure random string for NEXTAUTH_SECRET:
```bash
# On Unix/Linux/Mac
openssl rand -base64 32

# Or use an online generator
# https://generate-secret.vercel.app/32
```

## 🚀 Quick Start

1. **Create the .env file** with the variables above
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start the main platform:**
   ```bash
   npm run dev
   ```

5. **Start the WebSocket server (in a new terminal):**
   ```bash
   node scripts/websocket-server.js
   ```

6. **Access the platform:**
   - Main platform: http://localhost:3001
   - Collaborative workspace: http://localhost:3001/collaborative-workspace

## 🔍 Troubleshooting

### Authentication Errors
If you see authentication errors in the console:
- Ensure `NEXTAUTH_SECRET` is set
- Ensure `NEXTAUTH_URL` matches your local URL
- Check that the database is properly set up

### AI Features Not Working
If AI features aren't working:
- Ensure `OPENAI_SECRET_KEY` is set correctly
- Check that you have sufficient OpenAI credits
- Verify the API key has the necessary permissions

### WebSocket Connection Issues
If real-time features aren't working:
- Ensure the WebSocket server is running on port 3002
- Check that `WS_PORT` is set correctly
- Verify no firewall is blocking the connection

### Database Issues
If you encounter database errors:
- Run `npx prisma generate` to regenerate the client
- Run `npx prisma db push` to sync the schema
- Check that `DATABASE_URL` is correct

## 🧪 Testing the Setup

Run the status check script to verify everything is working:

```bash
node scripts/status-check.js
```

You should see:
- ✅ Main Platform (port 3001): RUNNING
- ✅ WebSocket Server (port 3002): RUNNING
- ✅ Collaborative Workspace: ACCESSIBLE
- ✅ All API endpoints responding

## 🔒 Security Notes

### Production Deployment
For production deployment:
- Use a strong, unique `NEXTAUTH_SECRET`
- Set `NEXTAUTH_URL` to your production domain
- Use a production database (PostgreSQL, MySQL, etc.)
- Enable HTTPS
- Set up proper environment variable management

### API Key Security
- Never commit API keys to version control
- Use environment variable management in production
- Rotate API keys regularly
- Monitor API usage and costs

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [WebSocket Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

## 🆘 Getting Help

If you encounter issues:
1. Check the console for error messages
2. Run the status check script
3. Verify all environment variables are set
4. Check the troubleshooting section above
5. Review the logs for specific error details 