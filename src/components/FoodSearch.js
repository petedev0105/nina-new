import React, { useState } from 'react';
import { Input, Button, Card, Modal, Spin } from 'antd';
import axios from 'axios';

const { Meta } = Card;

const FoodSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ common: [], branded: [] });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [nutritionInfo, setNutritionInfo] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`https://nina-render.onrender.com/search_food?query=${encodeURIComponent(query)}`);
      console.log(response);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching food:', error);
    }
    setLoading(false);
  };

  const handleItemClick = async (item) => {
    setSelectedFood(item);
    setModalVisible(true);
    try {
      const response = await axios.post(`https://nina-render.onrender.com/get_nutrition_info?nix_item_id=${encodeURIComponent(item.nix_item_id)}`);
      setNutritionInfo(response.data);
    } catch (error) {
      console.error('Error fetching nutrition info:', error);
      setNutritionInfo('Error fetching nutrition information');
    }
  };

  return (
    <div className="p-4 space-y-3">
      <div>
        <span className='font-semibold'>Food Search</span>
      </div>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter food name"
        className="mb-4"
      />
      <Button onClick={handleSearch} type="primary" className="mb-4">
        Search
      </Button>

      {loading && <Spin size="large" className="mb-4" />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* {results.common.map((item, index) => (
          <Card
            key={`common-${index}`}
            hoverable
            cover={<img alt={item.food_name} src={item.photo.thumb} />}
            onClick={() => handleItemClick(item)}
          >
            <Meta title={item.food_name} description={`Serving: ${item.serving_qty} ${item.serving_unit}`} />
          </Card>
        ))} */}
        {results.branded.map((item, index) => (
          <Card
            key={`branded-${index}`}
            hoverable
            cover={<img alt={item.food_name} src={item.photo.thumb} />}
            onClick={() => handleItemClick(item)}
          >
            <Meta 
              title={item.brand_name_item_name} 
              description={`${item.brand_name} - ${item.nf_calories} calories`} 
            />
          </Card>
        ))}
      </div>

      <Modal
        title={selectedFood?.food_name || selectedFood?.brand_name_item_name}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <pre>{nutritionInfo}</pre>
      </Modal>
    </div>
  );
};

export default FoodSearch;