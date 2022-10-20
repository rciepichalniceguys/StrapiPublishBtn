import React, { useState, useEffect, useRef } from "react";
import { request } from "@strapi/helper-plugin";
import { Button } from "@strapi/design-system/Button";

const PublishBtn = () => {
  const [checkedIDs, setCheckedIDs] = useState([]);

  const [publishedIDs, setPublishedIDs] = useState([]);
  const [draftIDs, setDraftIDs] = useState([]);

  const getPublishedIDs = (e) => {
    const published = [];
    const draft = [];

    document
      .querySelectorAll('input[type="checkbox"]:checked')
      .forEach((el) => {
        const el2 = el.parentElement.parentElement.querySelectorAll(
          'td[aria-colindex="6"]>div>span'
        )[0].textContent;
        if (el2 === "Draft") {
          draft.push(
            el.parentElement.parentElement.querySelectorAll(
              'td[aria-colindex="2"] > span'
            )[0].textContent
          );
          setDraftIDs(draft);
        } else if (el2 === "Published") {
          published.push(
            el.parentElement.parentElement.querySelectorAll(
              'td[aria-colindex="2"] > span'
            )[0].textContent
          );
          setPublishedIDs(published);
        } else {
          return;
        }
      });
    console.log("Published:", published);
    console.log("Draft:", draft);
  };

  const getCheckedIDs = (e) => {
    const ids = [];
    if (e.target.getAttribute("aria-label") === "Select all entries") {
      if (!e.target.checked) {
        setCheckedIDs([]);
        return;
      }
      document.querySelectorAll('input[type="checkbox"]').forEach((c) => {
        const elements = c.parentElement.parentElement.querySelectorAll(
          'td[aria-colindex="2"] > span'
        );
        if (elements.length > 0) ids.push(elements[0].textContent);
      });
      setCheckedIDs(ids);
      return;
    }
    document.querySelectorAll('input[type="checkbox"]:checked').forEach((c) => {
      const elements = c.parentElement.parentElement.querySelectorAll(
        'td[aria-colindex="2"] > span'
      );
      if (elements.length > 0) ids.push(elements[0].textContent);
    });
    setCheckedIDs(ids);
  };

  const handlePublish = async (option) => {
    if (option === "PUBLISH") {
      await request(`/publisher/publish`, {
        method: "PUT",
        body: { data: draftIDs },
      });
      location.reload();
      return;
    }
    await request(`/publisher/unpublish`, {
      method: "PUT",
      body: { data: publishedIDs },
    });
    location.reload();
  };

  useEffect(() => {
    document.addEventListener("click", getPublishedIDs, true);
    // document.addEventListener("click", checkFunc, true);
    return () => window.removeEventListener("click", getPublishedIDs);
  }, []);

  return (
    <>
      {!!(draftIDs.length > 0 || publishedIDs.length > 0) && (
        <Button onClick={() => handlePublish("PUBLISH")}>Publish IDs</Button>
      )}
      {!!(draftIDs.length > 0 || publishedIDs.length > 0) && (
        <Button onClick={() => handlePublish("UNPUBLISH")}>
          Unpublish IDs
        </Button>
      )}
    </>
  );
};

export default PublishBtn;
