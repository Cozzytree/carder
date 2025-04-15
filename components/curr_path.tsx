"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

function CurrPath() {
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>Task</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Task</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

export default CurrPath;
