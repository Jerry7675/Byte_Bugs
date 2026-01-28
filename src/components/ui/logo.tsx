import Image from 'next/image';
import React from 'react';
import logoImg from '@/(public)/logoinvest.png';

const LogoIcon = () => {
  return (
    <span className="w-12 h-12 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-green-400 via-green-200 to-green-500 flex items-center justify-center">
      <span className="text-green-900 font-bold text-lg md:text-xl">
        <Image src={logoImg} alt="InvestLink Logo" width={512} height={512} />
      </span>
    </span>
  );
};

export const LogoWithText = () => {
  return (
    <span className="flex items-center gap-2">
      <span>
        <LogoIcon />
      </span>
      <span className="font-display font-bold text-xl md:text-2xl text-green-900">
        Invest<span className="text-green-600">Link</span>
      </span>
    </span>
  );
};

export default LogoIcon;
