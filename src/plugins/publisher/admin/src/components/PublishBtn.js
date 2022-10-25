import React, { useState, useEffect, useRef } from "react";
import { request } from "@strapi/helper-plugin";
import { Alert } from "@strapi/design-system/Alert";
import { Typography } from "@strapi/design-system/Typography";
import { Popover } from "@strapi/design-system/Popover";
import { Button } from "@strapi/design-system/Button";
import { useLocalStorage } from "../utils/hooks";

const PublishBtn = () => {
  const [publishedIDs, setPublishedIDs] = useState([]);
  const [draftIDs, setDraftIDs] = useState([]);
  const [resStatus, setResStatus] = useLocalStorage("resStatus", null);
  const [resMessage, setResMessage] = useLocalStorage("resMessage", null);
  const buttonRef = useRef();

  const contentName = window.location.pathname.match(
    /api::[a-z\-]*.[a-z\-]*/g
  )[0];

  const getColumnNumber = (header) => {
    const param = document
      .querySelectorAll(`button[label="${header}"]`)[0]
      .parentElement.parentElement.parentElement.getAttribute("aria-colindex");
    return param;
  };

  const sortByStatus = (items, column) => {
    const published = [];
    const draft = [];
    items.forEach((item) => {
      const spanNode = item.parentElement.parentElement.querySelectorAll(
        `td[aria-colindex="${column}"]>div>span`
      );
      if (spanNode.length) {
        if (spanNode[0].textContent === "Draft") {
          draft.push(
            item.parentElement.parentElement.querySelectorAll(
              `td[aria-colindex="${getColumnNumber("id")}"] > span`
            )[0].textContent
          );
          setDraftIDs(draft);
        }
        if (spanNode[0].textContent === "Published") {
          published.push(
            item.parentElement.parentElement.querySelectorAll(
              `td[aria-colindex="${getColumnNumber("id")}"] > span`
            )[0].textContent
          );
          setPublishedIDs(published);
        }
      }
    });
  };

  const handleClick = (e) => {
    const stateColumnNumber = getColumnNumber("State");

    if (e.target.getAttribute("aria-label") === "Select all entries") {
      if (!e.target.checked) {
        setDraftIDs([]);
        setPublishedIDs([]);
        return;
      }
      const unchecked = document.querySelectorAll('input[type="checkbox"]');
      sortByStatus(unchecked, stateColumnNumber);
      return;
    }
    const checked = document.querySelectorAll('input[type="checkbox"]:checked');
    if (checked.length === 0) {
      setDraftIDs([]);
      setPublishedIDs([]);
      return;
    }
    sortByStatus(checked, stateColumnNumber);
  };

  const handlePublish = async (option) => {
    if (option === "PUBLISH") {
      const res = await request(`/publisher/publish`, {
        method: "PUT",
        body: { data: draftIDs, contentName },
      });
      setResStatus(res.status);
      setResMessage(res.message);
      location.reload();
      return;
    }
    const res = await request(`/publisher/unpublish`, {
      method: "PUT",
      body: { data: publishedIDs, contentName },
    });
    setResStatus(res.status);
    setResMessage(res.message);
    location.reload();
  };

  useEffect(() => {
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setResStatus(null);
      setResMessage(null);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [resStatus]);

  return (
    <>
      {!!draftIDs.length > 0 && (
        <Button onClick={() => handlePublish("PUBLISH")}>
          Publish selected
        </Button>
      )}
      {!!publishedIDs.length > 0 && (
        <Button onClick={() => handlePublish("UNPUBLISH")}>
          Unpublish selected
        </Button>
      )}
      <div ref={buttonRef} style={{ height: "39.95px" }}></div>
      {resStatus && (
        <Popover source={buttonRef} spacing={10} placement={"top"} padding={2}>
          <h2 style={{ color: resStatus === 200 ? "#C6F0C2" : "#F5C0B8" }}>
            {resMessage}
          </h2>
        </Popover>
      )}
    </>
  );
};

export default PublishBtn;
