import React from "react";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import MediaCard from "./MediaCard";

// select
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// hooks
import { useState, useEffect } from "react";
// axios
import axios from "axios";
// moment
import moment from "moment";

const MainContent = () => {
  let date = new Date();
  let titleDate = date.toLocaleDateString("ar", {
    month: "long",
    weekday: "long",
    year: "numeric",
    day: "numeric",
  });

  let cityLists = [
    { name: "مكة المكرمة", api: "SA,Makkah al Mukarramah" },
    { name: "الرياض", api: "SA,Riyadh" },
    { name: "القدس", api: "PS,quotes" },
    { name: "بوشهر", api: "Asaluyeh, بوشِهر، إيران" },
    { name: "خند", api: "أخند، بوشِهر، إيران" },
    { name: "جفر مبارك", api: "تشاه مبارك، بوشِهر، إيران" },
    { name: "طهران", api: "طهران ، إيران" },
  ];
  const ff = [
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Sunset", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
    { key: "Fajr", displayName: "الفجر" },
  ];

  const [cityName, setCityName] = useState({
    name: "خند",
    api: "أخند، بوشِهر، إيران",
  });
  const [timings, setTiming] = useState({});
  const [timer, setTimer] = useState();
  const [nextTimeState, setNextTimeState] = useState({
    key: "",
    displayName: "",
  });
  const getTimingReg = async () => {
    const data = await axios.get(
      "https://api.aladhan.com/v1/timingsByAddress?address=" +
        cityName.api +
        "?x7xapikey=a40781aef9e97ae7af3e549fb6a4e5ed&method=4"
    );
    setTiming(data.data.data.timings);
  };
  useEffect(() => {
    getTimingReg();
  }, [cityName]);

  useEffect(() => {
    let timerInterval = setInterval(() => {
      chechNextTimeFun();
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [timings]);
  const chechNextTimeFun = () => {
    let num;
    if (
      moment().isBefore(moment(timings.Fajr, "hh:mm")) &&
      moment().isAfter(moment(timings.Dhuhr, "hh:mm"))
    ) {
      num = 0;
    } else if (
      moment().isBefore(moment(timings.Dhuhr, "hh:mm")) &&
      moment().isAfter(moment(timings.Asr, "hh:mm"))
    ) {
      num = 1;
    } else if (
      moment().isBefore(moment(timings.Asr, "hh:mm")) &&
      moment().isAfter(moment(timings.Sunset, "hh:mm"))
    ) {
      num = 2;
    } else if (
      moment().isBefore(moment(timings.Sunset, "hh:mm")) &&
      moment().isAfter(moment(timings.Isha, "hh:mm"))
    ) {
      num = 3;
    } else {
      num = 4;
    }
    setNextTimeState(ff[num]);

    let un = moment(timings[ff[num].key], "hh:mm").diff();
    if (un < 0) {
      un =
        moment(timings[ff[num].key], "hh:mm").diff(moment("00:00", "hh:mm")) +
        moment("23:59", "hh:mm").diff();
    }

    setTimer(
      `${moment.duration(un).hours()}:${moment.duration(un).minutes()}:${moment
        .duration(un)
        .seconds()}`
    );
  };

  const handleChange = (event) => {
    setCityName({ ...event.target.value });
  };
  return (
    <div>
      <Grid container textAlign={"center"}>
        <Grid size={6}>
          <div>
            <h3>{titleDate}</h3>
            <h1>{cityName.name}</h1>
          </div>
        </Grid>
        <Grid size={6}>
          <div>
            <h4>الوقت المتبقي حتى صلاة {nextTimeState.displayName}</h4>
            <h1>{timer}</h1>
          </div>
        </Grid>
      </Grid>
      <Stack
        flexWrap={"wrap"}
        direction={"row"}
        justifyContent={"space-around"}
        gap={"15px"}
        className="prayers-box"
      >
        <MediaCard img="./m1.jpg" name="الفجر" time={timings.Fajr} />
        <MediaCard img="./m2.jpg" name="الظهر" time={timings.Dhuhr} />
        <MediaCard img="./m1.jpg" name="العصر" time={timings.Asr} />
        <MediaCard img="./m2.jpg" name="المغرب" time={timings.Sunset} />
        <MediaCard img="./m1.jpg" name="العشاء" time={timings.Isha} />
      </Stack>
      {/*  */}
      <div
        style={{
          width: "250px",
          margin: "20px auto",
          background: "white",
          borderRadius: "5px",
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">المدينة</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            onChange={handleChange}
          >
            {cityLists.map((c) => {
              return (
                <MenuItem key={c.api} value={c}>
                  {c.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default MainContent;
