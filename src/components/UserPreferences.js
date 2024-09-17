import React, { useState, useEffect } from "react";
import axios from "axios";
import { userOnboardedAtom, userAtom } from "@/app/jotai/user/atoms";
import { useAtom } from "jotai";

const UserInformationForm = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [goals, setGoals] = useState("");
  const [activityType, setActivityType] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [allergies, setAllergies] = useState("");
  const [dietaryPreferences, setDietaryPreferences] = useState("");
  const [sleep, setSleep] = useState("");
  const [stressLevel, setStressLevel] = useState("");
  const [workoutHistory, setWorkoutHistory] = useState("");
  const [dietaryIntake, setDietaryIntake] = useState("");
  const [waterIntake, setWaterIntake] = useState("");
  const [supplements, setSupplements] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [dailySteps, setDailySteps] = useState("");
  const [consent, setConsent] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);

  const [user, setUser] = useAtom(userAtom);
  

  const [userOnboarded, setUserOnboarded] = useAtom(userOnboardedAtom);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`/api/get-user-information`, {
          userId: user.id,
        });
  
        if (response.data.message === "no-rows") {
          // No rows found, handle accordingly (do nothing)
          return;
        }
  
        const data = response.data;
  
        console.log("get user information response is: ", response);
  
        // Basic Info
        setName(data.basic_info.name);
        setAge(data.basic_info.age);
        setGender(data.basic_info.gender);
        setHeight(data.basic_info.height);
        setWeight(data.basic_info.weight);
  
        // Health & Fitness
        setActivityLevel(data.health_fitness.activity_level);
        setGoals(data.health_fitness.goals);
        setActivityType(data.health_fitness.activity_types);
        setMedicalConditions(data.health_fitness.medical_conditions);
        setAllergies(data.health_fitness.allergies);
        setDietaryPreferences(data.health_fitness.dietary_preferences);
  
        // Lifestyle
        setSleep(data.lifestyle.sleep);
        setStressLevel(data.lifestyle.stress_level);
  
        // Fitness & Nutrition Data
        setWorkoutHistory(data.fitness_nutrition_data.workout_history);
        setDietaryIntake(data.fitness_nutrition_data.dietary_intake);
        setWaterIntake(data.fitness_nutrition_data.water_intake);
        setSupplements(data.fitness_nutrition_data.supplement_use);
  
        // Advanced Data
        setHeartRate(data.advanced_data.heart_rate);
        setDailySteps(data.advanced_data.daily_steps);
  
        // Privacy Consent
        setConsent(data.privacy_consent.data_collection_consent);
        setDataSharing(data.privacy_consent.data_sharing_preferences);
  
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [user.id]);

  const handleSubmit = async (e) => {
    const userId = user.id;
    if (
      name &&
      age &&
      gender &&
      height &&
      weight &&
      activityLevel &&
      goals &&
      activityType &&
      medicalConditions &&
      allergies &&
      dietaryPreferences &&
      sleep &&
      stressLevel &&
      workoutHistory &&
      waterIntake &&
      supplements &&
      consent &&
      dataSharing
    ) {
      e.preventDefault();
      const formData = {
        name,
        age,
        gender,
        height,
        weight,
        activity_level: activityLevel,
        goals,
        activity_type: activityType,
        medical_conditions: medicalConditions,
        allergies,
        dietary_preferences: dietaryPreferences,
        sleep,
        stress_level: stressLevel,
        workout_history: workoutHistory,
        water_intake: waterIntake,
        supplements,
        consent,
        data_sharing: dataSharing,
        // Optional fields
        dietary_intake: dietaryIntake || null,
        heart_rate: heartRate || null,
        daily_steps: dailySteps || null,
      };

      try {
        const response = await axios.post("/api/save-user-information", {
          userId,
          formData,
        });

        if (response.status === 200) {
          console.log("Data saved successfully");
          console.log(response);
          setUserOnboarded(true);
        } else {
          console.error("Error saving data:", response.data.error);
        }
      } catch (error) {
        console.error("Error saving data:", error);
      }
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">⚙️ Your Information</h2>

      <section>
        <h3 className="text-lg font-semibold">🧍 Basic Personal Information</h3>
        <label className="block">
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </label>
        <label className="block mt-2">
          Age
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </label>
        <label className="block mt-2">
          Gender
          <input
            type="text"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </label>
        <label className="block mt-2">
          Height (cm)
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </label>
        <label className="block mt-2">
          Weight (kg)
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </label>
      </section>

      <section>
        <h3 className="text-lg font-semibold">
          🏋️ Health and Fitness Information
        </h3>
        <label className="block">
          Activity Level
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          >
            <option value="">Select activity level</option>
            <option value="Lightly Active">Lightly Active (1-2 sessions / week)</option>
            <option value="Moderately Active">Moderately Active (3-5 sessions / week)</option>
            <option value="Highly Active">Highly Active (6-7 sessions / week)</option>
          </select>
        </label>
        <label className="block mt-2">
          Fitness Goals (Describe as best as you can)
          <input
            type="text"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </label>
        <label className="block mt-2">
          Types of Activity
          <input
            type="text"
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </label>
        <label className="block mt-2">
          Medical Conditions
          <input
            type="text"
            value={medicalConditions}
            onChange={(e) => setMedicalConditions(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </label>
        <label className="block mt-2">
          Allergies
          <input
            type="text"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </label>
        <label className="block mt-2">
        Dietary Preferences (what kind of foods do you like?)
          <input
            type="text"
            value={dietaryPreferences}
            onChange={(e) => setDietaryPreferences(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </label>
      </section>

      <section>
        <h3 className="text-lg font-semibold">🌙 Lifestyle Information</h3>
        <label className="block">
          Sleep
          <input
            type="text"
            value={sleep}
            onChange={(e) => setSleep(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </label>
        <label className="block mt-2">
          Perceived Stress Levels (1-10)
          <input
            type="number"
            value={stressLevel}
            onChange={(e) => setStressLevel(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </label>
      </section>

      <section>
        <h3 className="text-lg font-semibold">🥗 Fitness and Nutrition Data</h3>
        <label className="block">
        Workout history (how long have you been physically active?)
          <input
            type="text"
            value={workoutHistory}
            onChange={(e) => setWorkoutHistory(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </label>
        <label className="block mt-2">
        Caloric Intake (optional)
          <input
            type="text"
            value={dietaryIntake}
            onChange={(e) => setDietaryIntake(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </label>
        <label className="block mt-2">
          Water Intake
          <input
            type="text"
            value={waterIntake}
            onChange={(e) => setWaterIntake(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </label>
        <label className="block mt-2">
          Supplements taken
          <input
            type="text"
            value={supplements}
            onChange={(e) => setSupplements(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </label>
      </section>

      <section>
        <h3 className="text-lg font-semibold">📊 Advanced Data (Optional)</h3>
        <label className="block">
          Heart Rate (optional)
          <input
            type="text"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </label>
        <label className="block mt-2">
          Estimated Daily Steps Tracking (optional)
          <input
            type="text"
            value={dailySteps}
            onChange={(e) => setDailySteps(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </label>
      </section>

      <section>
        <h3 className="text-lg font-semibold">🔒 Privacy and Consent</h3>
        <label className="block mt-2">
          Consent for Data Collection
          <input
            type="checkbox"
            checked={consent}
            onChange={() => setConsent(!consent)}
            className="mt-1"
          />
        </label>
        <label className="block mt-2">
          Data Sharing Preferences
          <input
            type="checkbox"
            checked={dataSharing}
            onChange={() => setDataSharing(!dataSharing)}
            className="mt-1"
          />
        </label>
      </section>

      <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </form>
  );
};

export default UserInformationForm;
