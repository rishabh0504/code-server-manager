import { useEffect } from "react";
import { useFetchStream } from "@/hooks/use-fetch-stream";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type DockerExecutorLogsProps = {
  scriptId: string;
};

const DockerExecutorLogs: React.FC<DockerExecutorLogsProps> = ({
  scriptId,
}) => {
  const { data, loading, error, fetchStream, abort } = useFetchStream();

  useEffect(() => {
    if (scriptId) {
      fetchStream(
        `${process.env.NEXT_PUBLIC_BASE_API_POINT}/docker-scripts/${scriptId}/build-image`,
        {
          method: "GET",
        }
      );
    }
  }, [scriptId]);

  return (
    <Card className="w-full max-w-4xl mx-auto my-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Docker Build Logs
        </CardTitle>
        {loading && (
          <Button variant="destructive" size="sm" onClick={abort}>
            Abort
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-sm text-red-500 mb-2">
            Error: {error.message}
          </div>
        )}
        <pre className="bg-black text-green-400 text-sm rounded-md p-4 max-h-[400px] overflow-auto whitespace-pre-wrap shadow-inner">
          {data || (loading ? "Streaming logs..." : "No logs yet.")}
        </pre>
      </CardContent>
    </Card>
  );
};

export default DockerExecutorLogs;
