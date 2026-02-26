import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h2 className="text-3xl font-bold mb-6">
        Welcome to TaskFlow
      </h2>
      <div className="flex gap-4">
        <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded">
          Login
        </Link>
        <Link href="/register" className="bg-green-600 text-white px-6 py-2 rounded">
          Register
        </Link>
      </div>
    </div>
  );
}