import { getWebURL } from "@/lib/utils";
import * as fs from "fs";
import { join } from "path";
import satori from "satori";
import sharp from "sharp";

const FONT_DIR = join(process.cwd(), "font");

const interMedium = fs.readFileSync(join(FONT_DIR, "Inter-Medium.ttf"));
const interBold = fs.readFileSync(join(FONT_DIR, "Inter-Bold.ttf"));
const interLight = fs.readFileSync(join(FONT_DIR, "Inter-Light.ttf"));

export const generateRoastCardImage = async (
  roast: string,
  walletAddress: string,
  flameCount: number,
  litCount: number,
  dropletCount: number
) => {
  // Flame rendering without images (vector-based instead)
  // const renderFlames = () => {
  //   const flames = [];
  //   for (let i = 0; i < flameCount; i++) {
  //     flames.push(
  //       <div
  //         key={i}
  //         style={{
  //           width: 300,
  //           height: 300,
  //           backgroundImage: `url('${getWebURL()}/flame1-min.png')`,
  //           opacity: 0.6,
  //           position: "absolute",
  //           top: `${50 + i * 10}px`,
  //           left: `${50 + i * 15}px`,
  //         }}
  //       />
  //     );
  //   }
  //   return flames;
  // };

  const svg = await satori(
    <div tw="flex flex-col relative w-[320px] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
      {/* Branding: Logo at top-left */}
      <div tw=" flex">
        <div tw="flex flex-1">
          <img
            src="http://localhost:3001/logo.png"
            alt="OnlyRoasts Logo"
            tw="object-cover w-full h-full"
            height={50}
            width={50}
          />
        </div>

        <div tw="flex flex-1 flex-col">
          <p>OnlyRoasts</p>
          <p>{walletAddress}</p>
        </div>
      </div>

      {/* Render flames based on the 'lit' value */}
      <div tw="absolute flex top-0 z-0">
        <img
          src={`${getWebURL()}/flame1-min.png`}
          alt="Flames"
          tw="object-cover mix-blend-overlay h-full w-full"
          height={50}
          width={50}
        />
      </div>

      <div tw="flex flex-col relative p-3 sm:p-4 text-center z-10">
        {/* Roast text with text shadow */}
        <div tw="text-base sm:text-xl text-black bg-white text-start pb-3">
          {roast}
        </div>

        <div tw="flex justify-around mt-3 gap-3">
          {/* Flame Button with gradient and hover effects */}
          <div tw="flex-1 border border-red-400 bg-red-400 text-black py-2 rounded-xl shadow-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              //@ts-expect-error Used class instead of className
              class="lucide lucide-flame"
            >
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
            <span>{litCount}</span>
          </div>

          {/* Droplet Button with blue gradient */}
          <div tw="flex-1 border border-blue-300 bg-blue-300 text-black py-2 rounded-xl shadow-lg flex items-center justify-center ml-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              //@ts-expect-error Used class instead of className
              class="lucide lucide-droplet"
            >
              <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
            </svg>
            <span>{dropletCount}</span>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 500,
      height: 300,
      fonts: [
        { name: "Inter", data: interBold, weight: 800, style: "normal" },
        { name: "Inter", data: interMedium, weight: 600, style: "normal" },
        { name: "Inter", data: interLight, weight: 300, style: "normal" },
      ],
    }
  );

  const pngBuffer = await sharp(Buffer.from(svg))
    .png({ quality: 90 })
    .toBuffer();

  return pngBuffer.toString("base64");
};
