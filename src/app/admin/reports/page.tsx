'use client'

import {useGetRepostsQuery,
    useDeleteReportMutation,
    useBlockUserMutation,useBlockpostMutation} from '@/lib/linkTokApi'
    import { Button } from "@/ui/button";
    import {
        Dialog,
        DialogClose,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
      } from "@/ui/dialog"
import Loader from '@/ui/Loader';



export default function page(){
    const { data, isLoading, error ,refetch } = useGetRepostsQuery();
    const [blockpost]=useBlockpostMutation();
  const [deleteReport] = useDeleteReportMutation();
  const [blockUser] = useBlockUserMutation();

  if (isLoading) return <Loader />;
  if (error) return <div>Error fetching reports.</div>;


  


  const handleDelete = async (reportId: number) => {
    try {
      await deleteReport(reportId).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to delete report:', err);
    }
  };

  const handleBlockUser = async (userId: number, reportId: number) => {
    try {
      await blockUser(userId).unwrap();
      await deleteReport(reportId).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to block user or delete report:', err);
    }
  };

  const handleBlockPost = async (reportId: number,post_id:number,reportedForId:number) => {
    try {
      await blockpost(post_id).unwrap();
      await deleteReport(reportId).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to block user or delete report:', err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Reports</h1>
      {data && data.reports.length > 0 ? (
        <ul>
          {data.reports.map((report) => (
            <li key={report.reportId} className="p-4 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <p><strong>Report ID:</strong> {report.reportId}</p>
                  <p><strong>Reported By:</strong> {report.reportedByUsername}</p>
                  <p><strong>Reported for:</strong> {report.reportedForUsername}</p>
                  <p><strong>Reason:</strong> {report.reason}</p>
                  <p><strong>Post Caption:</strong> {report.post.caption}</p>
                  {/* Add more details as needed */}
                </div>
                <div>
                
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() =>  handleDelete(report.reportId)}
                  >
                    Delete Report
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded ml-2"
                    onClick={() => handleBlockUser(report.reportedForId, report.reportId)}
                  >
                    Block User
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded ml-2"
                    onClick={() => handleBlockPost(report.post.id,report.reportId,report.reportedForId)}
                  >
                    Block post
                  </button>
                </div>
                <Dialog >
  <DialogTrigger asChild>
    <Button variant="outline" >
       view post
    </Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-4xl max-h-[500px] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Post Details</DialogTitle>
      <DialogDescription>Details of the selected post</DialogDescription>
    </DialogHeader>

    {/* Display details of the selected post */}
    <div className="bg-white shadow rounded-lg p-4">
      <img
        className="h-48 w-full object-contain rounded-t-lg"
        src={report.mediaUrl}
        alt="Post Media"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{report.post.caption}</h2>
        <p className="text-gray-600">Tags: {report.post.tags}</p>
      </div>
    </div>


    <DialogFooter className="sm:justify-start">
      <DialogClose asChild>
        <Button type="button" variant="secondary">
          Close
        </Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>No reports found.</div>
      )}
    </div>
  );
}