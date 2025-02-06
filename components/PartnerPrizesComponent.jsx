import React from "react";
import PartnerPrizeCard from "./PartnerPrizeCard";

const PartnerPrizesComponent = () => {
  const partnerPrizes = [
    {
      partner: "privy",
      title: "Onboard with Privy",
      description:
        "Get a chance to win a free NFT by onboarding with Privy and getting roasted by our community.",
      photoBgColor: "bg-[#220901]",
      transform: "translate3d(0, 0, 0) rotate(1.8deg)",
      zIndex: 1,
    },
    {
      partner: "gaia",
      title: "Customized Gaia Agent",
      description:
        "Harness the power of the Gaia Agent to get a customized roast for your wallet.",
      photoBgColor: "bg-[#181918]",

      transform: "translate3d(0, 15px, 0) rotate(-2.6deg)",
      zIndex: 2,
    },
    {
      partner: "covalent",
      title: "Automate with Covalent",
      description:
        "Automating your roasts with Covalent to get real-time updates on your wallet.",
      photoBgColor: "bg-[#2d3047]",
      transform: "translate3d(14px,4px,0) rotate(2deg)",

      zIndex: 2,
    },

    {
      partner: "graph",
      title: "Query The Graph",
      description:
        "Query The Graph to get insights on your NFT Token and give feedback for the Agent.",
      photoBgColor: "bg-[#160f29]",
      transform: "translate3d(0, 20px, 0) rotate(-7deg)",
      zIndex: 4,
    },
  ];

  return (
    <div className="flex justify-center mt-[100px] gap-4">
      {partnerPrizes.map((prize, index) => (
        <PartnerPrizeCard
          key={index}
          number={index + 1}
          name={prize.partner}
          title={prize.title}
          description={prize.description}
          photoBgColor={prize.photoBgColor}
          transform={prize.transform}
          zIndex={prize.zIndex}
        />
      ))}
    </div>
  );
};

export default PartnerPrizesComponent;
