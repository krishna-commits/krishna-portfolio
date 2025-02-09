import { Card } from "app/theme/components/ui/card";
import { siteConfig } from "config/site";

export default function TechnologyList() {
    return (
    <div className="flex flex-wrap gap-3 justify-start">
        {siteConfig.technology_stack.map((item, index) => (
          <div key={index}>
            <Card className="px-3 py-1 flex space-x-2 justify-center align-middle  items-center">
            <img alt="GitHub logo"  src={item.imageUrl} className="h-6" />
            <p className="text-sm font-semibold leading-6 dark:text-slate-300">{item.name}</p>
            </Card>
          </div>
        ))}
      </div>
    );
  }
  
