
#JAVA_HOME = /home/pauldee/packages/lib/java
$(warning $(JAVA_HOME))

JAVAC = $(JAVA_HOME)/bin/javac
JAVA = $(JAVA_HOME)/bin/java
JAR = $(JAVA_HOME)/bin/jar
JAVAWS = $(JAVA_HOME)/bin/javaws
JAVADOC = $(JAVA_HOME)/bin/javadoc

EXT_JAR_DIR = ./lib
EXT_JARS_AUX := $(patsubst  ./lib/%.jar,:../lib/%.jar,$(wildcard ./lib/*.jar))
EXT_JARS := $(subst .jar ,.jar,$(EXT_JARS_AUX))

SRC_DIR = ./src/
SRC_FILES = $(SRC_DIR)/*.java
CLASS_DIR = ./build/
CLASS_FILES = $(CLASS_DIR)/*.class

CPATH = .$(EXT_JARS):../$(CLASS_DIR):./Events
BUILD_DIR=$(CLASS_DIR)

DIST_DIR=./dist

JAVAC_FLAGS = -g

JAVADOC_DIR = ../doc/javadoc
JAVADOC_ARGS = -d ../$(JAVADOC_DIR) -private -source

JAR_NAME = P2PNet.jar
JAR_ARGS = cvfm
MANIFEST = P2PNetManifest
MAIN_CLASS = P2PNet

JNLP = P2PNet.jnlp

all: run
class:
	cd $(SRC_DIR); \
	$(JAVAC) $(JAVAC_FLAGS) -cp $(CPATH) -d ../$(BUILD_DIR) *.java; \
	$(JAVAC) $(JAVAC_FLAGS) -cp $(CPATH) -d ../$(BUILD_DIR) Events/*.java; \
	cd ..;

class-warn:
	cd $(SRC_DIR); \
	$(JAVAC) $(JAVAC_FLAGS) -Xlint -cp $(CPATH) -d ../$(BUILD_DIR) *.java; \
	$(JAVAC) $(JAVAC_FLAGS) -Xlint -cp $(CPATH) -d ../$(BUILD_DIR) Events/*.java; \
	cd ..;

run: class
	cd $(BUILD_DIR); \
	$(JAVA) -cp $(CPATH) $(MAIN_CLASS); \
	cd ..;
	
run-discovery: class
	cd $(BUILD_DIR); \
	$(JAVA) -cp $(CPATH) DiscoverPeers; \
	cd ..;

run-text: class
	cd $(BUILD_DIR); \
	$(JAVA) -cp $(CPATH) $(MAIN_CLASS)TextExample; \
	cd ..;

jar: class 
	cd $(BUILD_DIR); \
	$(JAR) $(JAR_ARGS) $(JAR_NAME) $(MANIFEST) *.class; \
	cd ..;

doc:
	cd $(SRC_DIR); \
	$(JAVADOC) $(JAVADOC_ARGS) *.java; \
	$(JAVADOC) $(JAVADOC_ARGS) Event/*.java; \
	cd ..;


jar-deploy: jar doc
	cd $(BUILD_DIR); \
	cp $(JAR_NAME) ../$(DIST_DIR); \
	svn export --force ../$(SRC_DIR)/scripts ../$(DIST_DIR)/scripts; \
	cd ..;
	
run-jar: jar-deploy
	cd $(DIST_DIR); \
	$(JAVA) -jar $(JAR_NAME); \
	cd ..;

final: jar-deploy
	mkdir P2PNet; \
	cp -R $(DIST_DIR) $(EXT_JAR_DIR) $(JAVADOC_DIR) P2PNet; \
	tar -cvzf p2pnet.tar.gz P2PNet; \
	rm -rf P2PNet;

webstart: jar
	echo TODO

clean:
	rm -rf $(CLASS_FILES) $(BUILD_DIR)/*.jar $(BUILD_DIR)/.jxta $(DIST_DIR)/*.jar $(DIST_DIR)/scripts p2pnet.tar.gz $(JAVADOC_DIR)/* $(EXT_JAR_DIR)/cachedir;
	
