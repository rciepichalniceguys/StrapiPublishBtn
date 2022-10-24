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

  const getPublishedIDs = (e) => {
    const published = [];
    const draft = [];
    if (e.target.getAttribute("aria-label") === "Select all entries") {
      if (!e.target.checked) {
        setDraftIDs([]);
        setPublishedIDs([]);
        return;
      }
      document.querySelectorAll('input[type="checkbox"]').forEach((el) => {
        const spanNode = el.parentElement.parentElement.querySelectorAll(
          'td[aria-colindex="6"]>div>span'
        );
        if (spanNode.length) {
          if (spanNode[0].textContent === "Draft") {
            draft.push(
              el.parentElement.parentElement.querySelectorAll(
                'td[aria-colindex="2"] > span'
              )[0].textContent
            );
            setDraftIDs(draft);
          }
          if (spanNode[0].textContent === "Published") {
            published.push(
              el.parentElement.parentElement.querySelectorAll(
                'td[aria-colindex="2"] > span'
              )[0].textContent
            );
            setPublishedIDs(published);
          }
        }
      });
      return;
    }
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    const checked = document.querySelectorAll('input[type="checkbox"]:checked');
    if (checked.length === 0) {
      setDraftIDs([]);
      setPublishedIDs([]);
      return;
    }
    checked.forEach((el) => {
      // state -> th
      const spanNode = el.parentElement.parentElement.querySelectorAll(
        'td[aria-colindex="6"]>div>span'
      );
      if (spanNode.length) {
        if (spanNode[0].textContent === "Draft") {
          draft.push(
            el.parentElement.parentElement.querySelectorAll(
              'td[aria-colindex="2"] > span'
            )[0].textContent
          );
          setDraftIDs(draft);
        }
        if (spanNode[0].textContent === "Published") {
          published.push(
            el.parentElement.parentElement.querySelectorAll(
              'td[aria-colindex="2"] > span'
            )[0].textContent
          );
          setPublishedIDs(published);
        }
        return;
      }
      setDraftIDs([]);
      setPublishedIDs([]);
    });
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
    document.addEventListener("click", getPublishedIDs, true);
    return () => document.removeEventListener("click", getPublishedIDs);
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
