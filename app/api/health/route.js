import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    const timestamp = new Date().toISOString();
    
    // Test database connection
    let dbStatus = 'disconnected';
    try {
      await connectDB();
      dbStatus = 'connected';
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      dbStatus = 'error';
    }
    
    return NextResponse.json({
      status: "ok",
      db: dbStatus,
      timestamp: timestamp,
      service: "MindSoothe Journal API",
      version: "1.0.0"
    }, { status: 200 });
    
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: "error",
      db: "error",
      timestamp: new Date().toISOString(),
      message: "Health check failed"
    }, { status: 500 });
  }
}