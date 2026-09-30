// "use client";
// import { TPost } from "@/types/TPost";
// import React, { useState } from "react";
// import CreatePost from "./modal/CreatePost";
// import PostFilter from "./PostFilter";
// import { Divider } from "@nextui-org/react";
// import PostCard from "./PostCard";

// const NewsFeed = ({ posts }: { posts: TPost[] }) => {
//   const [data, setData] = useState(posts || []);

//   return (
//     <>
//       {/* filter with create button */}
//       <section className="flex my-4 justify-between items-center">
//         <div className="flex-1">
//           {/* create post modal */}
//           <CreatePost />
//         </div>
//         {/* filter */}
//         <div className="flex-1">
//           <PostFilter setData={setData} />
//         </div>
//       </section>
//       <Divider className="my-5 bg-default-300" />
//       {/* posts */}
//       <section className="grid grid-cols-1 gap-4">
//         {data?.length > 0 ? (
//           data?.map((post: TPost) => <PostCard key={post._id} post={post} />)
//         ) : (
//           <div className="min-h-72">
//             <h1 className="text-lg font-semibold">NO data found!</h1>
//           </div>
//         )}
//         {/* <h2 className="text-center my-5">No more data available</h2> */}
//       </section>
//     </>
//   );
// };

// export default NewsFeed;
