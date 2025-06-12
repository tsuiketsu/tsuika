import Banner from "./-components/banner";
import BookmarkStats from "./-components/bookmark-stats";
import PinnedBookmarks from "./-components/pinned-bookmarks";
import PinnedFolders from "./-components/pinned-folders";
import RecentBookmarks from "./-components/recent-bookmarks";
import Tasks from "./-components/tasks";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: RouteComponent,
});

const SectionTitle = (props: { title: string; summary: string }) => (
  <section>
    <h3 className="font-bold @md/dash:text-xl @lg/dash:text-2xl">
      {props.title}
    </h3>
    <p className="text-muted-foreground text-sm">{props.summary}</p>
  </section>
);

function RouteComponent() {
  return (
    <div className="@7xl/dash:max-w-8xl space-i-4 mx-auto flex w-full auto-rows-min flex-col gap-4 space-y-6 select-none @6xl/dash:flex-row">
      <div className="flex w-full flex-col space-y-4">
        <Banner />
        <section className="pt-8">
          <SectionTitle
            title="Dashboard"
            summary="A breaf review of your data"
          />
          <BookmarkStats />
        </section>
        <div className="grid w-full gap-4 @2xl/dash:grid-cols-2">
          <RecentBookmarks />
          <PinnedBookmarks />
        </div>
      </div>
      <div className="flex h-full w-full flex-col gap-4 space-y-6 rounded-lg @6xl/dash:max-w-md @6xl/dash:border @6xl:p-4">
        <PinnedFolders />
        <section className="space-y-4">
          <div className="inline-flex w-full items-center justify-between">
            <h4 className="font-bold">Tasks</h4>
            <Button variant="ghost" size="sm">
              Clear All
            </Button>
          </div>
          <Tasks />
        </section>
      </div>
    </div>
  );
}
