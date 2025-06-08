import Avatar from "@/components/ui/avatar";

export default function Banner() {
  return (
    <div
      className="relative overflow-hidden rounded-md @7xl/dash:col-span-2"
      style={{ aspectRatio: "11/5" }}
    >
      <img
        src="https://w.wallhaven.cc/full/47/wallhaven-47zo9v.jpg"
        alt="banner image of dashboard"
        className="size-full object-cover"
      />
      <div className="bg-background/60 absolute bottom-4 left-4 inline-flex h-14 items-center gap-3 rounded-full p-2 pr-8 font-sans backdrop-blur-sm">
        <Avatar
          src="https://imgs.search.brave.com/hNnGLoGEzvlZVRNNb4V6F6Qe-3_ZiR7gq5BnTWfuNOQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9wb3J0/cmFpdC1wcm9maWxl/LXByZXR0eS1hbmlt/ZS15b3VuZy13b21h/bi1idW4taGFpcnN0/eWxlLW9yYW5nZS1i/YWNrZ3JvdW5kLTMw/OTE0OTM2Ni5qcGc"
          alt="avatar image of dashboard"
          className="size-10"
        />
        <div className="flex flex-col">
          <span className="text-sm font-bold">Welcome back!</span>
          <span className="text-xs">John Wick</span>{" "}
        </div>
      </div>
    </div>
  );
}
