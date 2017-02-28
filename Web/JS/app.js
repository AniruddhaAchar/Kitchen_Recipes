/**
*  Module
*	
* Description
*/
var app =angular.module('recipes', ['ngRoute',"firebase",'ngMaterial']);

app.config(function($routeProvider,$locationProvider) {
	$locationProvider.hashPrefix('');
	$routeProvider
	.when("/",{
		templateUrl: 'pages/recipes.htm',
		controller: 'recipe_control'
	})
	.when("/add",{
		templateUrl: 'pages/addrecipe.htm',
		controller: 'addRecipeController'
	});
});

//Controller for the home page. Takes daat from firebase and displays it.
app.controller('recipe_control',  function($scope,$firebaseArray, $mdToast){
	var ref = firebase.database().ref('Recipes');
	$scope.recipes = $firebaseArray(ref);
});

//Controller for adding recipes.
app.controller('addRecipeController', function($scope,$firebaseArray,$location){

	//Make a recipe object and add the 
	$scope.recipe = {'Name':"",'Description':"","Ingredients":[{name:"",quantity:""},{name:"",quantity:""},{name:"",quantity:""}],"Steps":[{"Step 1":"empty"},{"Step 2":"empty"},{"Step 3":"empty"}]};

	//Add a flag to check if items added to list
	$scope.added = false;

	//Make an array of ingredients objects.
	$scope.ingredients = $scope.recipe.Ingredients;

	//An array of steps object
	$scope.steps = $scope.recipe.Steps;

	//Dynamically add input field is more ingredients are needed.
	$scope.addIngredientField = function(){
		$scope.ingredients.push({name:"",quantity:""});
		$scope.added = !$scope.added;
	};

	//Dynamically remove input field is more ingredients are needed.
	$scope.removeIngredientField = function(){
		var lastItem = $scope.ingredients.length-1;
		$scope.ingredients.splice(lastItem);
	};


	$scope.addSteps = function(){
		var lastStep = $scope.steps.length+1;
		var obj = {};
		obj["Step "+lastStep]=""
		$scope.steps.push(obj);
		$scope.added = !$scope.added;
	};

	$scope.removeSteps = function(){
		var lastStep = $scope.steps.length-1;
		$scope.steps.splice(lastStep);
		$mdToast.show(
			$mdToast.simple()
        .textContent('Simple Toast!')
        .position("top right" )
        .hideDelay(3000)
			);
	};

	function emptySteps() {
		console.log($scope.steps.length-1 )
		for (var i = 0; i <= $scope.steps.length-1 ; i++) {
			console.log($scope.steps[i])
			var value = _.values($scope.steps[i]);
			console.log("value:"+value);
			if(value === "empty"){
				console.log("Empty element")
				return true;
			}
		}
		return false;
	}

	function emptyIngredients() {
		for (var i = 0; i <= $scope.ingredients.length - 1; i++) {
			if($scope.ingredients[i]['name']===""||$scope.ingredients[i]['quantity']===""){
				return true;
			}
		}
		return false;
	}

	$scope.addRecipe = function(){
		if(emptyIngredients()){
			$scope.ingredientError = "One or more ingredients are left blank. Please fill them or remove the blank ingredient(s)";
			return;
		}
		if(emptySteps()){
			$scope.stepError = "One or more steps are left empty. Please fill the steps or remove them."
			console.log($scope.stepError)
			return;
		}
		var ref = firebase.database().ref('Recipes');
		var recipes = $firebaseArray(ref);
		recipes.$add($scope.recipe).then($location.path("/"))
	};

	
});


