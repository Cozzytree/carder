"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { dateFormat } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function Container({ designId }: { designId: Id<"designs"> }) {
  const [isCreateModal, setCreateModal] = useState(false);
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(600);

  const design_pages = useQuery(api.designs.getDesignPages, {
    design_id: designId,
  });
  const createNewPage = useMutation(api.designs.createDesignPage);

  const handleCreateNewPage = () => {
    createNewPage({
      design_id: designId,
      meta: { background: "", height, width },
    }).then((d) => {
      if (d) {
        setCreateModal(false);
      }
    });
  };

  return (
    <div className="w-full h-full">
      {design_pages?.length == 0 ? (
        <div className="w-full flex flex-col items-center gap-1">
          <span className="text-muted-foreground text-sm">no pages</span>
          <Button
            onClick={() => {
              setCreateModal(true);
            }}
            size={"xs"}
          >
            Create one <PlusIcon />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Pages</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {design_pages?.map((page, index) => (
              <Link href={`/design/${designId}/${page._id}`} key={index}>
                <div className="bg-muted/30 p-3 rounded-3xl flex gap-2 justify-between">
                  {page.meta.height}x{page.meta.height}
                  <span className="text-sm">
                    {dateFormat(page._creationTime)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Dialog open={isCreateModal} onOpenChange={setCreateModal}>
        <DialogContent>
          <DialogTitle>Create New Page</DialogTitle>

          <div className="flex gap-2">
            <Input
              value={width}
              onChange={(e) => {
                if (+e.target.value <= 200) return;
                setWidth(+e.target.value);
              }}
              type="number"
              placeholder="width"
              className="p-2"
            />
            <Input
              value={height}
              onChange={(e) => {
                if (+e.target.value <= 200) return;
                setHeight(+e.target.value);
              }}
              type="number"
              placeholder="height"
              className="p-2"
            />
          </div>

          <DialogFooter>
            <Button
              onClick={handleCreateNewPage}
              size={"xs"}
              variant={"secondary"}
            >
              Create page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Container;
