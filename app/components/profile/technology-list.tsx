import { Card } from "app/theme/components/ui/card";
import { siteConfig } from "config/site";

export default function TechnologyList() {
    return (
    <div className="flex flex-wrap gap-3 justify-start">
        {siteConfig.technology_stack.map((item) => (
          <div key={item.name}>
            <Card className="px-3 py-1 flex space-x-2 justify-center align-middle  items-center">
            <img
              alt=""
              src={item.imageUrl}
              width={24}
              height={24}
              className="h-6 w-6 object-contain shrink-0"
              aria-hidden
            />
            <p className="text-sm font-semibold leading-6 dark:text-slate-300">{item.name}</p>
            </Card>
          </div>
        ))}
      </div>
    );
  }
  
