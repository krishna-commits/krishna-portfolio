import { siteConfig } from "config/site";

export default function Copyright(){
    return(
      <div className="">
        <div className="w-full text-slate-700 flex space-x-20 justify-between text-center md:px-24 pb-5">
          <p>&copy; {siteConfig.copyright.text}</p>
          <p>{siteConfig.copyright.privacy}</p>
          <p>e-mail: {siteConfig.copyright.email} </p>
        </div>
      </div>

    )
}