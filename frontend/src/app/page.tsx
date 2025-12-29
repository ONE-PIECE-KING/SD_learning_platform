export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-primary-600 mb-4">
        SD Learning Platform
      </h1>
      <p className="text-gray-600 text-lg">
        線上學習平台 - 探索無限可能
      </p>
      <div className="mt-8 flex gap-4">
        <a
          href="/courses"
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          瀏覽課程
        </a>
        <a
          href="/auth/login"
          className="px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition"
        >
          登入
        </a>
      </div>
    </main>
  );
}
