import { ReactNode } from "react";

type props = {
   label: string;

   children: ReactNode;
   weight?: number;
};

const OptionLayout = ({ label, children, weight = 400 }: props) => {
   return (
      <div className="flex flex-col px-2 items-center">
         <div className="flex justify-between">{children}</div>
         <h6 style={{ fontWeight: weight }} className={`text-xs`}>
            {label}
         </h6>
      </div>
   );
};

export default OptionLayout;
