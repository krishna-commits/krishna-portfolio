import { Separator } from 'app/theme/components/ui/separator';
import Link from 'next/link';
import { allMantras } from ".contentlayer/generated"

const MantrasList = () => {
  const sortedItems = allMantras.sort(function (a: any, b: any) { return a.order - b.order });

  return (
    <div className="grid gap-5 ">
      {
        sortedItems.map((item, index) => (
          item.parent == null && item.grand_parent == null &&
          <div key={index}>
            <Link href={item.url} className="hover:underline text-2xl text-slate-900  font-semibold dark:text-slate-300" ># {item.title}</Link>
            <Separator className=" bg-slate-300 my-3 dark:bg-slate-900" />
            {
              sortedItems.map((child, index) => (
                <div key={index}>
                  {item.title == child.parent &&
                    <>
                      <Link href={child.url} className="hover:underline py-[1.5px] text-slate-800  font-semibold text-xl dark:text-slate-400">{child.title}</Link>
                      <div className='mb-4 text-slate-700 dark:text-slate-500'>{child.description}</div>
                      {sortedItems?.map((grandchild, index) => (
                        <>
                          {grandchild.parent == child.title && grandchild.grand_parent == item.title &&
                            <div key={index} className='border-l-2 pl-5 mb-4 border-slate-400 dark:border-slate-900'>
                              <div className="mt-1 flex items-center gap-x-2">
                                {
                                  grandchild.completed == true ? 
                                  <div className="flex-none rounded-full bg-emerald-500/20 p-0.5">
                                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
                                  </div>
                                  :
                                  <div className="flex-none rounded-full bg-amber-500/20 p-0.5">
                                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500"></div>
                                  </div>
                                }
                             
                                <Link href={grandchild.url} className="text-slate-800  font-bold dark:text-slate-400">
                                  {grandchild.title}
                                </Link>
                              </div>


                              <p className='text-slate-700 text-sm dark:text-slate-500'>
                                {grandchild.description}
                              </p>
                            </div>
                          }
                        </>
                      ))}
                    </>
                  }
                </div>
              ))
            }
          </div>
        ))
      }
    </div>
  );
};

export default MantrasList;

