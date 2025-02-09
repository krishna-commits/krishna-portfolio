import { Badge } from "app/theme/components/ui/badge"
import { siteConfig } from "config/site";


// export default function EducationList() {
//     return (
//       <ul role="list">
//         {siteConfig.education.map((item, index) => (
//           <div key={index}>
//             <li className={`flex justify-between gap-x-4 py-3 ${index === siteConfig.education.length - 1 ? '' : 'border-b'}`}>
//               <div className="flex min-w-0 w-full space-x-4 justify-center items-center">
//                 <img className="h-14 w-14 ring-1 ml-1 ring-slate-200 flex-none rounded-full bg-gray-50" src={item.imageURL} alt="" />
//                 <div className="flex flex-col w-full ">
//                   <div className="flex flex-col md:flex-row md:space-x-3 justify-between">
//                     <p className="text-sm md:text-sm font-semibold text-left dark:text-slate-300">{item.organization}</p>
//                     <div className="w-fit text-muted-foreground text-[10px] px-0">{item.time}</div>
//                   </div>
//                   <p className="text-xs leading-5 dark:text-slate-500">{item.course}, {item.university}</p>
//                 </div>
//               </div>
//             </li>
//           </div>
//         ))}
//       </ul>
//     );
//   }
  
