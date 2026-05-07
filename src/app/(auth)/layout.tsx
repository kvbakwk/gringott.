import Image from "next/image";
import { redirect } from "next/navigation";


import AuthMainNav from "@components/navs/AuthMainNav";
import AuthOtherNav from "@components/navs/AuthOtherNav";
import { RouteSegments } from "@utils/routes";
import { verifySession } from "@utils/session";
import AuthFormsContainer from "./AuthFormsContainer";




export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  if ((await verifySession()).isAuth) redirect(`/${RouteSegments.HomePage}`);

  return (
    <div 
      className="grid grid-cols-[1fr_500px_1fr] w-screen h-screen"
      style={{ background: 'linear-gradient(225deg, #0183ff33, #79590C33)' }}
    >
      <div className="flex flex-col gap-[150px] justify-center items-center w-full h-full">
        <div className="font-bold text-primary text-[57px] text-center w-[250px] h-[70px]">
          portfel.
        </div>
        <AuthMainNav />
      </div>
      <div className="flex justify-center items-center w-full h-full">
        <AuthFormsContainer />
        {children}
      </div>


      <div className="grid grid-rows-[1fr_100px] w-full h-full">
        <div className="flex flex-col justify-center items-center w-full h-full">
          <AuthOtherNav />
        </div>
        <div className="flex justify-center items-center text-primary font-bold w-full h-[70px] mb-[30px] py-[10px] select-none">
          <div style={{ color: '#0183ff', paddingRight: '4px' }}>twój</div>
          <div style={{ color: '#2ca74c' }}>świat</div>
          <div style={{ color: '#e23841' }}>.</div>
          <Image 
            src="/logo.svg" 
            alt="Logo Gringott" 
            width={48} 
            height={48} 
            priority
          />
        </div>

      </div>
    </div>
  );
}
