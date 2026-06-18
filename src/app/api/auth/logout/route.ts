import { NextResponse } from 'next/server';

export async function POST() {
  // 登出主要是客户端清除cookie，这里只是返回成功
  return NextResponse.json({ success: true });
}
