import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 text-gray-800">

        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
            <h1 className="text-xl font-bold text-indigo-600">
              TaskFlow
            </h1>
            <span className="text-sm text-gray-500">
              Secure Task Manager
            </span>
          </div>
        </nav>

        {children}

      </body>
    </html>
  );
}