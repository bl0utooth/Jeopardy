let categories = [];

const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CAT = 5;

async function getCategoryIds() {
  const response = await axios.get('https://jservice.arcanine.io/api/categories?count=100');
  const allCategoryIds = response.data.map(category => category.id);

  const selectedCategoryIds = [];
  for (let i = 0; i < NUM_CATEGORIES; i++) {
    const randomIndex = Math.floor(Math.random() * allCategoryIds.length);
    selectedCategoryIds.push(allCategoryIds.splice(randomIndex, 1)[0]);
  }

  return selectedCategoryIds;
}

async function getCategory(catId) {
  const response = await axios.get(`https://jservice.arcanine.io/api/category?id=${catId}`);
  const category = {
    title: response.data.title,
    clues: response.data.clues.map(clue => ({ question: clue.question, answer: clue.answer, showing: null })),
  };
  return category;
}

async function fillTable() {
  const categoryIds = await getCategoryIds();

  for (const catId of categoryIds) {
    const category = await getCategory(catId);
    categories.push(category);
  }

  const jeopardyTable = $('#jeopardy');
  const theadRow = $('<tr>');
  categories.forEach(category => {
    theadRow.append($('<td>').text(category.title));
  });
  jeopardyTable.find('thead').html(theadRow);

  const tbody = jeopardyTable.find('tbody');
  for (let i = 0; i < NUM_QUESTIONS_PER_CAT; i++) {
    const tr = $('<tr>');
    categories.forEach(category => {
      tr.append($('<td>').text('?').click(handleClick));
    });
    tbody.append(tr);
  }
}


function handleClick(evt) {
  const td = $(evt.target);
  const row = td.parent().index();
  const col = td.index();
  const clue = categories[col].clues[row];

  if (clue.showing === null) {
    td.text(clue.question);
    clue.showing = 'question';
  } else if (clue.showing === 'question') {
    td.text(clue.answer);
    clue.showing = 'answer';
  }
}

function showLoadingView() {
}

function hideLoadingView() {
}

async function setupAndStart() {
  showLoadingView();
  categories = []; 
  await fillTable();
  hideLoadingView();
}

$('#restart-btn').click(setupAndStart);

$(document).ready(function () {
  setupAndStart(); 
});
