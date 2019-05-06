import { OutputTerminal, TerminalConfig, InputTracker, KeyAction, KeyEventType } from 'terminaltxt';

let term: OutputTerminal;
let input: InputTracker;

let interrupt: Interrupt;

class Interrupt {

  public interrupted: boolean;

  constructor() {
    this.interrupted = false;
    this.interrupt = this.interrupt.bind(this);
  }

  interrupt() {
    this.interrupted = true;
  }

}

init();

function init(): void {
  interrupt = new Interrupt();
  input = new InputTracker();
  input.addAction({
    keys: ['i', 'I'],
    keyEventType: KeyEventType.KEYPRESS,
    action: interrupt.interrupt,
  } as KeyAction);
  term = new OutputTerminal(
    {
      width: 40,
      container: document.getElementById('container'),
    } as TerminalConfig, 
    '                                        ' // start at the correct width
  );
  term.newLine();
  commodorePrintOut();
  term.newLine();
  simulateWriteOut('(Press i at any time for more info.)', () => {
    term.newLine();
    simulateWriteOut('10 PRINT CHR$(205.5+RND(1)); : GOTO 10', () => {
      interrupt.interrupted = false;
      simulateWriteOut('RUN', tenPrint);
    });
  });
}

function simulateWriteOut(text: string, callback: Function, endWithNewLine: boolean = true): void {
  if (text.length === 0) {
    if (endWithNewLine) {
      term.newLine();
    }
    callback();
    return;
  } else {
    setTimeout(() => {
      term.write(text.substring(0, 1));
      simulateWriteOut(text.substring(1, text.length), callback);
    }, Math.random() * 100 + 50);
  }
}

function commodorePrintOut(): void {
  term.writeln('    **** COMMODORE 64 BASIC V2 ****');
  term.newLine();
  term.writeln(' 64K RAM SYSTEM  38911 BASIC BYTES FREE')
  term.newLine();
  term.writeln('READY.');
  term.newLine();
}

function tenPrint(): void {
  setTimeout(() => {
    term.write(Math.random() > 0.5 ? '\\' : '/');
    if (!interrupt.interrupted) {
      tenPrint();
    } else {
      information();
    }
  }, 10);
}

function information(): void {
  term.writeln('BREAK IN 10');
  term.writeln('READY.');
  term.newLine();
  term.writeln('This is an example created by Fi Graham for the TerminalTXT library.')
  term.newLine();
  term.writeln('More about 10 Print:');
  term.writeln('10print.org');
  term.newLine();
  term.writeln('Thanks to Devin Cook for the font.')
  term.writeln('www.dafont.com/commodore-64.font');
  term.newLine();
  term.writeln('Source Code: ')
  term.writeln('github.com/figraham/terminaltxt-10print')
  term.newLine();
  interrupt.interrupted = false;
  term.writeln('RUN');
  term.newLine();
  tenPrint();
}