# Communication Plan API - Migration to Vercel with Supabase

This document outlines the migration of the Communication Plan backend from Flask + SQLite to Next.js API routes with Supabase (PostgreSQL) for deployment on Vercel.

## 🚀 Migration Overview

### What Changed
- **Backend Framework**: Flask → Next.js API Routes
- **Database**: SQLite → Supabase (PostgreSQL)
- **Deployment**: Local/Server → Vercel (Serverless)
- **ORM**: SQLAlchemy → Supabase JavaScript Client
- **Authentication**: None → Supabase Auth (ready for future implementation)

### What Stayed the Same
- **API Endpoints**: All original endpoints maintained
- **Data Structure**: Same database schema, adapted for PostgreSQL
- **Business Logic**: Core functionality preserved
- **Response Format**: Consistent JSON responses

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **Supabase Account** (free tier available)
3. **Vercel Account** (free tier available)

## 🛠️ Setup Instructions

### 1. Supabase Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. In the Supabase SQL Editor, run the schema creation script:

```sql
-- Copy and run the contents of supabase/schema.sql
```

### 2. Local Development Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment variables:
```bash
cp .env.local.example .env.local
```

3. Update `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

### 3. Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy!

## 🔄 API Endpoints

All original Flask endpoints have been migrated to Next.js API routes:

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get project by ID
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `GET /api/projects/[id]/complete` - Get complete project data

### Stakeholders
- `GET /api/projects/[id]/stakeholders` - Get project stakeholders
- `POST /api/projects/[id]/stakeholders` - Create stakeholder
- `GET /api/stakeholders/[id]` - Get stakeholder by ID
- `PUT /api/stakeholders/[id]` - Update stakeholder
- `DELETE /api/stakeholders/[id]` - Delete stakeholder
- `POST /api/projects/[id]/stakeholders/bulk` - Bulk create stakeholders

### Communication Plans
- `GET /api/projects/[id]/communication-plan` - Get communication plan
- `POST /api/projects/[id]/communication-plan` - Create communication plan
- `PUT /api/projects/[id]/communication-plan` - Update communication plan

### Communication Matrix
- `GET /api/communication-plans/[id]/matrix` - Get communication matrix
- `POST /api/communication-plans/[id]/matrix` - Create matrix entry
- `PUT /api/matrix/[id]` - Update matrix entry
- `DELETE /api/matrix/[id]` - Delete matrix entry
- `POST /api/communication-plans/[id]/matrix/bulk` - Bulk create matrix entries

### Export & Validation
- `GET /api/projects/[id]/export?format=json` - Export project data
- `GET /api/projects/[id]/export?format=validate` - Validate project

## 🗄️ Database Schema Changes

### Key Changes from SQLite to PostgreSQL:
1. **Primary Keys**: `INTEGER` → `UUID` (using `uuid_generate_v4()`)
2. **JSON Fields**: `TEXT` → `JSONB` (native JSON support)
3. **Timestamps**: Added `created_at` and `updated_at` triggers
4. **Relationships**: Proper foreign key constraints with CASCADE
5. **Indexes**: Added performance indexes
6. **RLS**: Row Level Security enabled (ready for multi-tenancy)

### Schema Benefits:
- **Better Performance**: PostgreSQL optimizations
- **Data Integrity**: Proper foreign key constraints
- **Scalability**: Cloud-native database
- **Security**: Built-in RLS support
- **JSON Support**: Native JSONB for complex data

## 🔧 Code Architecture

### File Structure
```
├── lib/
│   └── supabase.js          # Supabase client and utilities
├── pages/api/
│   ├── users/
│   │   ├── index.js         # GET, POST /api/users
│   │   └── [id].js          # GET, PUT, DELETE /api/users/[id]
│   ├── projects/
│   │   ├── index.js         # GET, POST /api/projects
│   │   ├── [id].js          # GET, PUT, DELETE /api/projects/[id]
│   │   └── [id]/
│   │       ├── complete.js  # GET /api/projects/[id]/complete
│   │       ├── stakeholders.js
│   │       ├── communication-plan.js
│   │       └── export.js
│   ├── stakeholders/
│   ├── communication-plans/
│   └── matrix/
├── supabase/
│   └── schema.sql           # Database schema
├── next.config.js           # Next.js configuration
├── vercel.json              # Vercel deployment config
└── package.json             # Dependencies
```

### Key Features:
- **Error Handling**: Consistent error responses
- **CORS Support**: Proper CORS headers
- **Validation**: Input validation and sanitization
- **Type Safety**: Structured response formats
- **Performance**: Parallel queries where possible

## 📊 Response Format

All APIs return a consistent response format:

```json
{
  "success": true,
  "data": { /* response data */ },
  "error": null
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "data": null
}
```

## 🔐 Security Considerations

1. **Environment Variables**: Sensitive data stored in environment variables
2. **Input Validation**: All inputs validated and sanitized
3. **SQL Injection**: Prevented by using Supabase client
4. **CORS**: Proper CORS configuration
5. **Rate Limiting**: Can be added via Vercel or Supabase
6. **Authentication**: Ready for Supabase Auth integration

## 🚀 Performance Optimizations

1. **Serverless**: Automatic scaling with Vercel
2. **Database Indexes**: Optimized database queries
3. **Parallel Queries**: Multiple operations run concurrently
4. **Caching**: Can be added with Vercel Edge caching
5. **Connection Pooling**: Handled by Supabase

## 📈 Monitoring & Debugging

1. **Vercel Analytics**: Built-in performance monitoring
2. **Supabase Dashboard**: Database insights and logs
3. **Console Logging**: Structured logging in API routes
4. **Error Tracking**: Can integrate with Sentry or similar

## 🔄 Migration from Flask

If you're migrating data from the old Flask app:

1. **Export Data**: Use the old Flask app to export data
2. **Transform Data**: Convert SQLite data to PostgreSQL format
3. **Import Data**: Use Supabase dashboard or API to import
4. **Verify**: Test all endpoints to ensure data integrity

## 🎯 Future Enhancements

1. **Authentication**: Add Supabase Auth for user management
2. **Real-time**: Use Supabase realtime for live updates
3. **File Upload**: Add file storage with Supabase Storage
4. **PDF Export**: Add PDF generation with libraries like jsPDF
5. **Email Notifications**: Integrate with email services
6. **Multi-tenancy**: Use RLS for tenant isolation

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Errors**: Check Next.js configuration and API route headers
2. **Database Connection**: Verify Supabase credentials and network
3. **UUID Issues**: Ensure UUID extension is enabled in Supabase
4. **Environment Variables**: Check variable names and values
5. **Deployment Issues**: Verify Vercel configuration and build process

### Debug Steps:

1. Check Vercel function logs
2. Review Supabase logs in dashboard
3. Test API endpoints locally
4. Verify database schema and data
5. Check environment variables

## 📚 Additional Resources

- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Vercel Deployment Guide](https://vercel.com/docs/concepts/deployments/overview)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Note**: This migration maintains backward compatibility with the original Flask API while providing better scalability, performance, and deployment options with modern cloud-native technologies.