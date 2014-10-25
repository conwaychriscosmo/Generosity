#
# A number of make targets to simpligy testing and setup tasks
#

# Default target: run all the tests
.PHONY: all_tests
all_tests ::

# Run the unit tests
.PHONY: unit_tests
unit_tests: 
	@echo "\n=======  Running unit tests =========\n"
	python serverTest.py
all_tests :: unit_tests

# Run the functional tests
# The functional tests are discovered by scanning files that start with test... for unittest.TestCase subclasses
.PHONY: func_tests
func_tests:
	@echo "\n======= Running functional tests ======\n"
	python -m unittest discover -v $(TESTARGS)

all_tests :: func_tests