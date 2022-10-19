import React, { useState, useEffect, useRef } from "react";
import { Button } from "@strapi/design-system/Button";

const URL = "http://localhost:1337/publisher/publishall";
const URL_IDS = "http://localhost:1337/publisher/publish";

const PublishBtn = () => {
  const [checkedIDs, setCheckedIDs] = useState([]);

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

  const publishAll = async () => {
    const res = await fetch(URL);
    location.reload();
  };

  const publishByIds = async (id) => {
    const res = await fetch(`${URL_IDS}/${id}`);
    location.reload();
  };

  const handlePublishAll = () => {
    publishAll();
  };
  const handlePublishIds = () => {
    checkedIDs.map((id) => {
      publishByIds(id);
    });
  };

  useEffect(() => {
    document.addEventListener("click", getCheckedIDs, true);
    // document.addEventListener("click", checkFunc, true);
    return () => window.removeEventListener("click", getCheckedIDs);
  }, []);

  return (
    <>
      {/* <Button onClick={handlePublishAll}>Publish All</Button> */}

      {!!checkedIDs.length > 0 && (
        <Button
          onClick={handlePublishIds}
          disabled={checkedIDs.length > 0 ? false : true}
        >
          Publish IDs
        </Button>
      )}
    </>
  );
};

export default PublishBtn;
