import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function Calendar() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "15min" });
      cal("floatingButton", {
        calLink: "matheus-santos-de-lima-gvijas/15min",
        config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
        buttonPosition: "bottom-right",
        buttonText: "Agendar Reunião",
      });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  return null;
}

  