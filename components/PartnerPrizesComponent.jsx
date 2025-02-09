import React from "react";
import PartnerPrizeCard from "./PartnerPrizeCard";

const PartnerPrizesComponent = () => {
  const partnerPrizes = [
    {
      partner: "privy",
      title: "Onboard with Privy",
      description:
        "Sign up for OnlyRoasts with Privy and create your Web3 wallet for a chance to win a free NFT and get playfully roasted by our community!",
      photoBgColor: "bg-[#220901]",
      transform: "translate3d(0, 0, 0) rotate(1.8deg)",
      zIndex: 1,
    },
    {
      partner: "covalent",
      title: "Automate with Covalent",
      description:
        "Chat with our Covalent-powered bot to effortlessly execute transactions using natural language, all while bracing yourself for some lighthearted roasts.",
      photoBgColor: "bg-[#2d3047]",

      transform: "translate3d(0, 15px, 0) rotate(-2.6deg)",
      zIndex: 2,
    },
    {
      partner: "graph",
      title: "Query The Graph",
      description:
        "Query The Graph to get insights on your NFT Token and give feedback for the Agent.",
      photoBgColor: "bg-[#160f29]",
      transform: "translate3d(14px,4px,0) rotate(2deg)",
      zIndex: 2,
    },

    {
      partner: "opsec",
      title: "Decentralize with Opsec",
      description: "  Hosting frontend using onesec  ",
      photoBgColor: "bg-[#151515]",

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
