import React, { useState, useEffect } from "react";
import { request } from "@strapi/helper-plugin";
import { Button } from "@strapi/design-system/Button";

const PublishBtn = () => {
  const [publishedIDs, setPublishedIDs] = useState([]);
  const [draftIDs, setDraftIDs] = useState([]);

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
    document
      .querySelectorAll('input[type="checkbox"]:checked')
      .forEach((el) => {
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
  };

  const handlePublish = async (option) => {
    if (option === "PUBLISH") {
      const res = await request(`/publisher/publish`, {
        method: "PUT",
        body: { data: draftIDs, contentName },
      });
      location.reload();
      return;
    }
    const res = await request(`/publisher/unpublish`, {
      method: "PUT",
      body: { data: publishedIDs, contentName },
    });
    location.reload();
  };

  useEffect(() => {
    document.addEventListener("click", getPublishedIDs, true);
    return () => document.removeEventListener("click", getPublishedIDs);
  }, []);

  return (
    <>
      {!!draftIDs.length > 0 && (
        <Button onClick={() => handlePublish("PUBLISH")}>Publish IDs</Button>
      )}
      {!!publishedIDs.length > 0 && (
        <Button onClick={() => handlePublish("UNPUBLISH")}>
          Unpublish IDs
        </Button>
      )}
    </>
  );
};

export default PublishBtn;
