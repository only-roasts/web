import { Roboto_Mono } from "next/font/google";

const roboto_mono = Roboto_Mono({
  variable: "--font-roboto_mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const PartnerPrizeCard = ({
  name,
  number,
  title,
  description,
  photoBgColor,
  zIndex,
  transform,
}) => {
  const style = {
    backgroundImage: `url(/${name}-logo.png)`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
  };

  // Dynamically generate the divStyle based on the 'number' prop
  const divStyle = {
    // Handle the different cases for the 'number' prop
    transform,
    zIndex,
    boxShadow:
      "calc(-2.5px + var(--shadowX)*5px) calc(-3px + var(--shadowY)*6px) 0 0 rgba(9,50,78,.23),calc(5px - var(--shadowX)*10px) calc(5px - var(--shadowY)*10px) 0 0 rgba(0,0,0,.15) inset",
  };

  return (
    <div
      className="w-[320px] relative border border-[#3b6a83] px-5 pt-5 pb-8 bg-white rounded-lg"
      style={divStyle}
    >
      <div className="flex text-2xl justify-center items-center bg-[#FF5159] text-[#fff] w-12 h-12 rounded-full absolute -top-6 -left-6 border-[#FF5159] border font-semibold">
        {number}
      </div>
      <div
        className={`w-full h-[300px] mb-2 border rounded-lg ${photoBgColor} p-10`}
      >
        {name == "covalent" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="200"
            viewBox="0 0 35 35"
            fill="none"
          >
            <path
              d="M30.8378 8.22551L22.1549 0.823777C21.5292 0.292555 20.7269 -0.000101195 19.8965 2.62482e-08H3.43305C2.98221 2.62482e-08 2.53574 0.0864209 2.11922 0.254334C1.7027 0.422247 1.32427 0.668371 1.00548 0.978634C0.686693 1.2889 0.433804 1.6572 0.261276 2.06258C0.0887484 2.46796 2.67324e-06 2.90244 2.67324e-06 3.34122V21.257C-0.000608324 21.733 0.103525 22.2036 0.305427 22.6372C0.507329 23.0707 0.8023 23.4571 1.17049 23.7705L9.85119 31.1722C10.4793 31.7081 11.2867 32.0024 12.122 32H28.5669C29.4774 32 30.3507 31.648 30.9945 31.0213C31.6383 30.3947 32 29.5449 32 28.6587V10.743C32.0014 10.2671 31.8985 9.79632 31.6981 9.36219C31.4977 8.92806 31.2043 8.54052 30.8378 8.22551ZM16.0031 22.145C14.7531 22.1454 13.5311 21.785 12.4916 21.1094C11.4522 20.4338 10.6419 19.4733 10.1634 18.3494C9.68484 17.2256 9.55955 15.9888 9.80331 14.7956C10.0471 13.6024 10.6489 12.5065 11.5327 11.6462C12.4166 10.786 13.5427 10.2002 14.7687 9.96298C15.9947 9.72574 17.2655 9.84772 18.4202 10.3135C19.5749 10.7792 20.5618 11.5678 21.256 12.5795C21.9502 13.5911 22.3206 14.7805 22.3202 15.997C22.3199 16.8048 22.1561 17.6046 21.8381 18.3508C21.5202 19.097 21.0543 19.7749 20.4671 20.3458C19.88 20.9168 19.1829 21.3695 18.4159 21.6782C17.6489 21.9869 16.8269 22.1455 15.9969 22.145H16.0031Z"
              fill="#54FE6D"
            />
          </svg>
        ) : (
          <div style={style} className="h-full"></div>
        )}
      </div>
      <p className="text-3xl font-semibold uppercase tracking-wide ">{title}</p>
      <p className={`${roboto_mono.className} text-sm mt-3 font-semibold `}>
        {description}
      </p>
    </div>
  );
};

export default PartnerPrizeCard;
