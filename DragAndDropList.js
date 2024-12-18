import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const DragAndDropList = ({ recipes, onReorder }) => {
  const moveCard = (dragIndex, hoverIndex) => {
    const updatedRecipes = [...recipes];
    const [dragged] = updatedRecipes.splice(dragIndex, 1);
    updatedRecipes.splice(hoverIndex, 0, dragged);
    onReorder(updatedRecipes);
  };

  return (
    <div>
      {recipes.map((recipe, index) => (
        <DragAndDropCard
          key={recipe.id}
          recipe={recipe}
          index={index}
          moveCard={moveCard}
        />
      ))}
    </div>
  );
};

const DragAndDropCard = ({ recipe, index, moveCard }) => {
  const [, ref] = useDrop({
    accept: 'recipe',
    hover: (item) => {
      if (item.index !== index) moveCard(item.index, index);
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'recipe',
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={(node) => drag(ref(node))} className="p-4 border">
      <h3>{recipe.title}</h3>
    </div>
  );
};

export default DragAndDropList;
