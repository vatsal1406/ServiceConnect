export default function Logo({ textSize = "text-4xl" }) {
  return (
    <h1
      className={`${textSize} font-bold tracking-tight flex items-center gap-2`}
    >
      <span className="text-gray-700 ">
        Service
      </span>

      <span className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
        Connect
      </span>
    </h1>
  );
}