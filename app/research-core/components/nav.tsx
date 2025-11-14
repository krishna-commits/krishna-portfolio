import Link from 'next/link';
import { allResearchCores } from "contentlayer/generated"

const NavigationList = () => {
  const sortedItems = allResearchCores.sort(function(a:any, b:any){return a.order - b.order});
  
  return (
    <nav className="grid gap-2 text-sm text-muted-foreground sticky top-20 overflow-scroll h-[86vh] no-scrollbar">
      <h2 className="font-semibold text-slate-900 text-xl dark:text-slate-400">Content</h2>
      {
        sortedItems.map((item, index) => (
          item.parent == null && item.grand_parent == null &&
          <div key={index}>

            <div className="text-primary pb-2 text-slate-900 font-semibold dark:text-slate-300">{item.title}</div>
            {
              sortedItems.map((child, index) => (
                <>
                  {item.title == child.parent &&
                    <div key={index} className={`border-l border-slate-200 dark:border-slate-900`}>
                      <div className='flex space-x-1 pt-3'>
                        <div className='w-[15px] border-t col-span-2 border-[0.5px]  h-0 justify-center items-center align-middle mt-[10px]'></div>
                          <Link href={child.url} className="w-full py-[1.5px] text-primary text-slate-700 font-medium dark:text-slate-400 ">{child.title}</Link>
                      </div>
                      {sortedItems?.map((grandchild, index) => (
                        <>
                          {grandchild.parent == child.title && grandchild.grand_parent == item.title &&
                            <div key={index} className={`flex space-x-1 col-span-10 ml-6  py-[1.5px] border-l pt-1 border-slate-200 dark:border-slate-900`}>
                              <div className='w-[15px] border-t  border-[0.5px] border-slate-200 h-0 justify-center items-center align-middle mt-2 '></div>
                              <Link href={grandchild.url} className=" w-full text-primary text-slate-500 dark:text-slate-500 hover:text-cyan-700">
                                {grandchild.title}
                              </Link>
                            </div>
                          }
                        </>
                      ))}
                    </div>
                  }
                </>
              ))
            }
          </div>
        ))
      }
    </nav>
  );
};

export default NavigationList;

