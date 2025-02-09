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
  
export default function CertificationList() {
  if (!siteConfig?.certification || siteConfig.certification.length === 0) {
    return <p className="text-center text-gray-500">No certifications available.</p>;
  }

  return (
    <ul role="list">
      {siteConfig.certification.map((item, index) => (
        <li
          key={item.issuedby}
          className={`flex justify-between gap-x-4 py-3 ${
            index === siteConfig.certification.length - 1 ? '' : 'border-b'
          }`}
        >
          <div className="flex min-w-0 gap-x-5">
            {/* Dialog for Certificate Preview */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="link"
                  className="p-3 h-16 w-auto flex-none hover:scale-105 transition-opacity"
                >
                  <img className="h-16 w-auto flex-none" src={item.imageURL} alt={item.title} />
                </Button>
              </DialogTrigger>
              <DialogContent className="h-fit">
                <DialogHeader className="pt-9 text-center flex flex-col items-center space-y-2">
                  <DialogTitle className="dark:text-foreground text-cyan-950 font-normal font-serif text-3xl md:text-3xl tracking-tighter text-center">
                    {item.title}
                  </DialogTitle>
                  <DialogDescription className="text-sm italic text-center">
                    Issued By: {item.issuedby}
                  </DialogDescription>
                  <Button asChild variant="link" className="italic text-cyan-700">
                    <Link href={item.link}>
                      <FileBadge /> Verify Certificate
                    </Link>
                  </Button>
                </DialogHeader>
                <img className="w-full flex-none" src={item.imageURL} alt={item.title} />
              </DialogContent>
            </Dialog>

            {/* Certification Details */}
            <div className="min-w-0 flex-auto">
              <div className="flex gap-2">
                <Link
                  rel="noopener noreferrer"
                  target="_blank"
                  href={item.link}
                  className="text-sm font-semibold leading-6 dark:text-slate-300 hover:underline"
                >
                  {item.title}
                </Link>
              </div>
              <p className="truncate text-xs leading-5 dark:text-slate-500">{item.issuedby}</p>
              <p className="text-xs font-light leading-6 dark:text-slate-300">{item.time}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}