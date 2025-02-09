import { siteConfig } from "config/site";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "app/theme/components/ui/dialog"
import { Button } from "app/theme/components/ui/button";
import { FileBadge } from "lucide-react";
export default function CertificationList() {
  return (
    <ul role="list">
      {siteConfig.certification.map((item, index) => (
        <div key={item.issuedby}>
          <li className={`flex justify-between gap-x-4 py-3 ${index === siteConfig.certification.length - 1 ? '' : 'border-b'}`}>
            <div className="flex min-w-0 gap-x-5">

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className=" p-3 h-16 w-auto flex-none hover:scale-105 transition-opacity">
                    <img className="h-16 w-auto flex-none" src={item.imageURL} alt="" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="h-fit">
                  <DialogHeader className="pt-9 text-center flex flex-col items-center space-y-2">
                    <DialogTitle className="dark:text-foreground text-blue-950 font-normal font-serif text-3xl md:text-3xl tracking-tighter text-center">{item.title}</DialogTitle>
                    <DialogDescription className="text-sm italic text-center">
                      Issued By: {item.issuedby}
                    </DialogDescription>
                    <Button asChild variant={"link"} className="italic text-blue-700">
                      <Link href={item.link} > 
                      <FileBadge />Verify Certificate
                      </Link>
                    </Button>
                  </DialogHeader>
                  <img className="w-full flex-none" src={item.imageURL} alt="" />
                  {/* <DialogFooter>
                  
                  </DialogFooter> */}
                </DialogContent>
              </Dialog>


              <div className="min-w-0 flex-auto">
                <div className="flex gap-2">
                  <Link rel="noopener noreferrer" target="_blank" href={item.link} className="text-sm font-semibold leading-6 dark:text-slate-300 hover:underline">
                    {item.title}
                  </Link>
                </div>
                <p className="truncate text-xs leading-5 dark:text-slate-500">{item.issuedby}</p>
                <p className="text-xs font-light leading-6 dark:text-slate-300">{item.time}</p>
              </div>
            </div>
          </li>
        </div>
      ))}
    </ul>
  );
}

